import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert bid analyst. Extract structured scope information from this RFP/bid document. Return ONLY valid JSON with no markdown formatting, using this exact structure: { "requirements": [{ "id": string, "category": string, "description": string, "priority": "must-have" | "should-have" | "nice-to-have" }], "evaluationCriteria": [{ "criterion": string, "weight": string, "notes": string }], "constraints": [{ "type": string, "description": string }], "clientPriorities": [{ "priority": string, "evidence": string }], "capabilityAreas": [{ "area": string, "description": string, "relevanceToScope": string }], "scopeSummary": string }`;

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

    const client = new Anthropic({ apiKey });

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this document and extract the structured scope data:\n\n${text}`,
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

    let parsed;
    try {
      parsed = JSON.parse(textBlock.text);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response as JSON. Please try again." },
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
