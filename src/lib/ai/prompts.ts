import { AiTransformType } from "@/lib/types";

/**
 * Prompt configuration for the "Transform Transcript" panel.
 * Keep these here so they're easy to tune without touching app logic.
 *
 * Each entry has a UI label, a short description, and a system prompt.
 * The transcript text is appended as the user message at request time.
 */

export interface PromptDef {
  type: AiTransformType;
  label: string;
  description: string;
  system: string;
  /** Whether this option needs the user's custom instruction. */
  requiresInput?: boolean;
}

export const SHARED_GUIDANCE =
  "You are given a raw video transcript. It may contain filler words, ASR errors, and missing punctuation. Infer intent generously, but never invent facts that are not supported by the transcript. Write in clear, plain language.";

export const PROMPTS: PromptDef[] = [
  {
    type: "summary",
    label: "Summary",
    description: "A concise but useful overview.",
    system:
      "Write a concise summary of the transcript in 1–3 short paragraphs. Capture the main argument and the most important supporting points. Be useful, not exhaustive.",
  },
  {
    type: "bullet_notes",
    label: "Bullet Notes",
    description: "Organized notes grouped by topic.",
    system:
      "Produce organized bullet notes grouped under clear topic headings. Use nested bullets where helpful. Keep each bullet tight and skimmable.",
  },
  {
    type: "key_takeaways",
    label: "Key Takeaways",
    description: "5–10 punchy takeaways.",
    system:
      "Extract 5–10 key takeaways as a numbered list. Each takeaway should be a single, self-contained insight a reader could act on or remember.",
  },
  {
    type: "blog_post",
    label: "Blog Post",
    description: "A clean, readable article.",
    system:
      "Rewrite the content as a clean blog post: a compelling title, a short intro, clear section headings, and a brief conclusion. Use natural prose. Do not reference 'the video' or 'the transcript'; write as an original article on the topic.",
  },
  {
    type: "linkedin_post",
    label: "LinkedIn Post",
    description: "Professional, no hashtags.",
    system:
      "Write a professional LinkedIn post based on the most interesting insight in the transcript. Hook in the first line, scannable short paragraphs, a thoughtful close. Do NOT use hashtags or emojis unless essential.",
  },
  {
    type: "x_thread",
    label: "X / Twitter Thread",
    description: "Numbered short posts.",
    system:
      "Write an engaging X/Twitter thread. Format as numbered posts (1/, 2/, …). Each post under 280 characters, one idea each. Open with a strong hook and end with a takeaway.",
  },
  {
    type: "study_guide",
    label: "Study Guide",
    description: "Terms, concepts, and questions.",
    system:
      "Create a study guide with three sections: Key Terms (term — definition), Core Concepts (short explanations), and Review Questions (open-ended questions to test understanding).",
  },
  {
    type: "meeting_notes",
    label: "Meeting Notes",
    description: "Structured recap.",
    system:
      "Write structured meeting notes: a one-line summary, Discussion Points, Decisions, and Open Questions. Only include sections that are supported by the content.",
  },
  {
    type: "action_items",
    label: "Action Items",
    description: "Only if clearly present.",
    system:
      "Extract concrete action items as a checklist. ONLY include items that are clearly stated or strongly implied. If there are no clear action items, respond exactly with: 'No clear action items found in this transcript.'",
  },
  {
    type: "custom",
    label: "Custom Prompt",
    description: "Run your own instruction.",
    requiresInput: true,
    system:
      "Follow the user's instruction precisely, using the transcript as the source material. If the instruction cannot be satisfied from the transcript, say so briefly.",
  },
];

export function getPrompt(type: AiTransformType): PromptDef | undefined {
  return PROMPTS.find((p) => p.type === type);
}

/** Client-safe list (no secrets) for rendering the panel. */
export const PROMPT_OPTIONS = PROMPTS.map(({ type, label, description, requiresInput }) => ({
  type,
  label,
  description,
  requiresInput: !!requiresInput,
}));
