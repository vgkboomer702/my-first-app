import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const MAX_TEXT_LENGTH = 50_000;

const SYSTEM_PROMPT = `You are a senior solution intelligence analyst helping a bid team develop a differentiated, winning proposal. You have been given:
1. An AI-extracted scope analysis from an RFP document
2. The bid team's self-assessment of their capabilities in each scope area
3. The bid team's deal strategy including win themes, differentiators, positioning, and competitor intelligence

Generate a Solution Intelligence Brief in JSON format. Return ONLY valid JSON with no markdown formatting, no code fences.

Use this exact structure:
{
  "reportTitle": "Solution Intelligence Brief: [Client/Deal Name]",
  "generatedDate": "ISO date string",
  "scopeSummary": "2-3 paragraph executive summary of the opportunity",
  "capabilityMap": [
    {
      "area": "string",
      "status": "strong-current | strong-stale | weak | gap",
      "currentApproach": "What the team currently does",
      "recommendation": "What they should propose instead or in addition",
      "reasoning": "Why this recommendation matters for this specific deal",
      "confidence": "verified | inferred | assumption"
    }
  ],
  "intelligenceCards": [
    {
      "area": "string",
      "status": "strong-current | strong-stale | weak | gap",
      "conventionalApproach": "What most vendors will propose",
      "options": [
        {
          "title": "Option name",
          "description": "What it is in plain English",
          "whyItMatters": "Why it matters for THIS deal specifically",
          "howItWorks": "Technical detail for feasibility assessment",
          "marketMaturity": "bleeding-edge | emerging | established",
          "realWorldExample": "Named organization that has done this with outcomes",
          "vendorsAndPartners": "Specific companies and what they offer",
          "integrationComplexity": "low | medium | high",
          "risks": "Key risks and trade-offs",
          "dealAlignment": "How this aligns with the stated win themes and strategy",
          "confidence": "verified | inferred | assumption",
          "confidenceReasoning": "Why this confidence level"
        }
      ]
    }
  ],
  "efficiencyOpportunities": [
    {
      "opportunity": "string",
      "description": "string",
      "estimatedImpact": "string",
      "confidence": "verified | inferred | assumption"
    }
  ],
  "partnerLandscape": [
    {
      "partner": "Company name",
      "relevantArea": "Which capability area",
      "whatTheyOffer": "string",
      "whyTheyFit": "string",
      "confidence": "verified | inferred | assumption"
    }
  ],
  "strategicWarnings": [
    {
      "warning": "string",
      "impact": "string",
      "suggestedAction": "string"
    }
  ]
}

Rules:
- For areas marked 'strong-stale', this is the BOILERPLATE KILLER - show what the conventional approach is AND provide 2-3 newer alternatives that would differentiate
- For areas marked 'gap', provide 2-3 build/partner/alternative options
- For areas marked 'weak', provide strengthening options
- For areas marked 'strong-current', confirm the position and suggest how to leverage it as a differentiator
- Every recommendation must tie back to the deal strategy and win themes
- Be specific with vendor names, product names, and real examples
- Clearly tag confidence levels and explain reasoning
- Include at least one strategic warning about risks or blind spots`;

function extractJson(raw: string): object {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in response");
  }
  return JSON.parse(raw.slice(start, end + 1));
}

export async function POST(req: NextRequest) {
  try {
    const { scopeAnalysis, capabilities, strategy, documentText } =
      await req.json();

    if (!scopeAnalysis) {
      return NextResponse.json(
        { error: "No scope analysis provided" },
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

    const docText = documentText
      ? documentText.slice(0, MAX_TEXT_LENGTH)
      : "(No raw document text available)";

    const userMessage = `Here is the full context for generating the Solution Intelligence Brief:

## SCOPE ANALYSIS (AI-extracted from RFP)
${JSON.stringify(scopeAnalysis, null, 2)}

## CAPABILITY SELF-ASSESSMENT (from bid team)
${JSON.stringify(capabilities || [], null, 2)}

## DEAL STRATEGY (from bid team)
${JSON.stringify(strategy || {}, null, 2)}

## RAW DOCUMENT TEXT (first ${MAX_TEXT_LENGTH.toLocaleString()} chars)
${docText}

Generate the Solution Intelligence Brief now.`;

    const client = new Anthropic({ apiKey });

    const stream = client.messages.stream({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
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
    console.log(
      "Report generation raw response (first 500 chars):",
      rawText.slice(0, 500)
    );

    let parsed;
    try {
      parsed = extractJson(rawText);
    } catch {
      console.error("JSON parse failed. Full response:", rawText);
      return NextResponse.json(
        {
          error: `Failed to parse AI response as JSON. Raw response: ${rawText.slice(0, 300)}...`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ report: parsed });
  } catch (err: unknown) {
    console.error("Report generation error:", err);

    if (err instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Invalid Anthropic API key. Check your .env.local file." },
        { status: 401 }
      );
    }
    if (err instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        {
          error:
            "Rate limited by Claude API. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: `Report generation failed: ${message}` },
      { status: 500 }
    );
  }
}
