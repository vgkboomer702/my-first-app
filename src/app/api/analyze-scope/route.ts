import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const MAX_TEXT_LENGTH = 50_000;

const SYSTEM_PROMPT = `You are an expert bid analyst. Extract structured scope information from this RFP/bid document. Return ONLY valid JSON with no markdown formatting, no code fences, using this exact structure: { "requirements": [{ "id": string, "category": string, "description": string, "priority": "must-have" | "should-have" | "nice-to-have" }], "evaluationCriteria": [{ "criterion": string, "weight": string, "notes": string }], "constraints": [{ "type": string, "description": string }], "clientPriorities": [{ "priority": string, "evidence": string }], "capabilityAreas": [{ "area": string, "description": string, "relevanceToScope": string }], "scopeSummary": string }`;

function extractJson(raw: string): object {
  // Strip markdown code fences
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  // Find the first { and last } to extract the JSON object
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }

  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const { text, filename } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No document text provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const truncated = text.length > MAX_TEXT_LENGTH;
    const docText = truncated ? text.slice(0, MAX_TEXT_LENGTH) : text;
    const truncationNote = truncated
      ? `\n\nNote: This document was truncated to the first ${MAX_TEXT_LENGTH.toLocaleString()} characters for initial analysis.`
      : "";

    const client = new Anthropic({ apiKey });

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this document and extract the structured scope data:${truncationNote}\n\n${docText}`,
        },
      ],
    });

    const response = await stream.finalMessage();

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "No text response from Claude" },
        { status: 502 }
      );
    }

    const rawText = textBlock.text;
    console.log("Claude raw response (first 500 chars):", rawText.slice(0, 500));

    let parsed;
    try {
      parsed = extractJson(rawText);
    } catch {
      console.error("JSON parse failed. Full response:", rawText);
      return NextResponse.json(
        { error: `Failed to parse AI response as JSON. Raw response: ${rawText.slice(0, 300)}...` },
        { status: 502 }
      );
    }

    return NextResponse.json({ analysis: parsed, filename });
  } catch (err: unknown) {
    console.error("Scope analysis error:", err);

    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Invalid Anthropic API key. Check your .env.local file." },
        { status: 401 }
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Rate limited by Claude API. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: `Scope analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
