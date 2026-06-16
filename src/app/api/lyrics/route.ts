import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a professional songwriter and lyricist with deep roots in Afrobeats, Afrofusion, Nigerian street music, and global soul music. Your writing carries cinematic weight — every line feels born under pressure, painted with imagery that is heavy, cosmic, and street-sharp at once.

RHYTHM NOTATION:
The user provides a rhythm pattern using syllable sounds:
- "ti" = short, light, unstressed syllable
- "tii" = medium-weight syllable
- "ta" = long, heavy, stressed syllable
- Spaces separate each syllable beat
- Every lyric line you write MUST follow this exact syllable count and stress pattern

RULES:
1. Count the syllables in the rhythm pattern — every line must have the EXACT same syllable count
2. Heavy syllables (ta) must land on stressed, powerful, or long words
3. Light syllables (ti) land on unstressed, quick, or small words
4. Write like a songwriter — lines must feel singable, breathable, and natural in the mouth
5. Do NOT force rhymes — rhymes happen only when they serve the emotion
6. Every line must carry weight, vivid imagery, and sonic impact
7. Honor the language flavor completely — Pidgin stays Pidgin, Afrobeats slang stays authentic, mixed blends organically
8. Channel the mood/vibe in every word choice and image
9. Return ONLY the lyrics — no annotations, no syllable counts, no explanations, no titles

STYLE REFERENCE (the energy to channel):
"Dem no wan gemme chance when sky no fit overpopulate"
"Blood of my ancestors run through celestial coordinates"
"We no dey fold when the pressure start to congregate"
"E don reach where the universe owe me compensation"

This is the sound — heavy, orbital, street-philosophical. Match this frequency.`;

export async function POST(req: NextRequest) {
  try {
    const { rhythm, mood, language, section } = await req.json();

    if (!rhythm || !mood || !language || !section) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const syllableCount = rhythm
      .trim()
      .split(/\s+/)
      .filter((s: string) => s.length > 0).length;

    const userPrompt = `Write a ${section} for a ${mood} song.

Rhythm pattern: ${rhythm}
Syllable count per line: ${syllableCount} syllables
Language flavor: ${language}
Song section: ${section}
Mood/vibe: ${mood}

Every single line must have exactly ${syllableCount} syllables matching the stress pattern: ${rhythm}
Generate 4–8 lines for this ${section}.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const lyrics =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ lyrics });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to generate lyrics.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
