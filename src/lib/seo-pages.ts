import { FaqItem } from "@/components/Faq";

export interface SeoSection {
  heading: string;
  body: string;
}

export interface SeoPage {
  slug: string;
  title: string; // <title>
  metaDescription: string;
  h1: string;
  intro: string[]; // paragraphs above the tool
  sections: SeoSection[]; // body content below the tool
  faqs: FaqItem[];
  related: string[]; // slugs to internal-link
}

export const SEO_PAGES: SeoPage[] = [
  {
    slug: "youtube-transcript-generator",
    title: "YouTube Transcript Generator — Free & Instant",
    metaDescription:
      "Generate a clean, accurate transcript from any YouTube video in seconds. Free, no signup, with timestamps and TXT/Markdown/SRT/VTT export.",
    h1: "Free YouTube Transcript Generator",
    intro: [
      "Paste a YouTube link and get a clean, readable transcript in seconds. LinkTranscript pulls the captions directly, tidies up the spacing, and lays everything out with clickable timestamps so you can jump straight to any moment in the video.",
      "There is no signup required for single transcripts. Once the transcript loads you can search it, copy it with or without timestamps, and export it as TXT, Markdown, SRT, or VTT — ready to drop into your notes, docs, or video editor.",
    ],
    sections: [
      {
        heading: "Why use a transcript generator?",
        body: "A transcript turns a video you would otherwise have to scrub through into text you can skim, search, and quote. Researchers cite sources accurately, students review lectures faster, and creators repurpose a single video into articles and posts. Reading is simply quicker than watching when you already know what you are looking for.",
      },
      {
        heading: "How accurate are the transcripts?",
        body: "Accuracy depends on the captions YouTube provides. Creator-uploaded captions are typically near-perfect, while auto-generated captions are good but can miss punctuation or misjudge names. LinkTranscript always prefers a manually-created track when one exists, and lets you switch languages when multiple tracks are available.",
      },
      {
        heading: "Timestamps you can actually use",
        body: "Every line is tagged with its start time. Click a timestamp and the embedded player jumps to that exact moment, which makes it easy to verify a quote or find the part you care about. Prefer clean prose? Toggle timestamps off and copy a tidy paragraph instead.",
      },
    ],
    faqs: [
      {
        q: "Is the YouTube transcript generator free?",
        a: "Yes. Generating and exporting single transcripts is free and requires no account.",
      },
      {
        q: "Does it work on auto-generated captions?",
        a: "Yes. If a video only has auto-generated captions, those are used. Creator-uploaded captions are preferred when available.",
      },
      {
        q: "Can I export the transcript?",
        a: "Yes — TXT, Markdown, SRT, and VTT, each including the video title, source URL, and generation date.",
      },
      {
        q: "What if a video has no captions?",
        a: "If a video has no captions at all, there is no transcript to extract and LinkTranscript will tell you so clearly.",
      },
    ],
    related: ["youtube-to-text", "youtube-video-summary", "youtube-transcript-to-notes"],
  },
  {
    slug: "youtube-to-text",
    title: "YouTube to Text — Convert Videos to Text Free",
    metaDescription:
      "Convert any YouTube video to text instantly. Clean, copyable transcript with timestamps and one-click export. Free and no signup.",
    h1: "Convert YouTube to Text",
    intro: [
      "Turn any YouTube video into clean, copyable text. Paste the link, and LinkTranscript converts the video's captions into a readable transcript you can search, copy, and export in seconds.",
      "It is the fastest way to get the words out of a video — whether you need a quote, a full script, or text to feed into another tool.",
    ],
    sections: [
      {
        heading: "From video to plain text in one step",
        body: "There is nothing to install and nothing to configure. Paste a URL, get text. The output is cleaned of repeated whitespace and broken into readable lines, with the video's title and source preserved so your text always has context.",
      },
      {
        heading: "Copy clean text or keep timestamps",
        body: "Need a clean block of prose? Copy without timestamps. Need to reference specific moments? Keep them in. You can also select any portion of the transcript and copy just that quote.",
      },
      {
        heading: "Great for accessibility and reuse",
        body: "Text is searchable, screen-reader friendly, and easy to translate or summarize. Converting video to text makes content usable in ways video alone never can.",
      },
    ],
    faqs: [
      {
        q: "How do I convert a YouTube video to text?",
        a: "Paste the video URL into the box above and click Get Transcript. The text appears in seconds.",
      },
      {
        q: "Is there a length limit?",
        a: "Long videos work fine. The full transcript is extracted for reading, copying, and export regardless of length.",
      },
      {
        q: "Can I convert text from a playlist?",
        a: "Playlist transcripts are on the roadmap. For now, convert videos one at a time.",
      },
      {
        q: "Do you keep my text?",
        a: "No. Transcripts are generated on demand and not stored permanently in this version.",
      },
    ],
    related: ["youtube-transcript-generator", "copy-youtube-transcript", "video-to-markdown"],
  },
  {
    slug: "copy-youtube-transcript",
    title: "Copy YouTube Transcript — One Click, Clean Text",
    metaDescription:
      "Copy any YouTube transcript with one click — with or without timestamps. Clean, formatted text ready to paste anywhere. Free, no signup.",
    h1: "Copy a YouTube Transcript Instantly",
    intro: [
      "Grab the full transcript of any YouTube video and copy it with a single click. Choose to keep timestamps for reference or copy clean prose for writing and notes.",
      "LinkTranscript formats the text so it pastes cleanly into Google Docs, Notion, email, or anywhere else — no stray line breaks or duplicated spaces.",
    ],
    sections: [
      {
        heading: "Two copy modes",
        body: "Copy with timestamps when you need to cite specific moments, or copy clean text when you just want the words. A per-line copy button also lets you lift a single quote without grabbing the whole transcript.",
      },
      {
        heading: "Paste-ready formatting",
        body: "Whitespace is collapsed, lines are tidy, and the structure survives the paste. What you copy is what you get in your document.",
      },
      {
        heading: "No account, no friction",
        body: "There is no login wall between you and the copy button. Paste a link, copy the text, move on.",
      },
    ],
    faqs: [
      {
        q: "Can I copy without timestamps?",
        a: "Yes. Use the Copy clean text button for prose without timestamps.",
      },
      {
        q: "Can I copy just one quote?",
        a: "Yes. Hover any line for a copy button, or select text and use Copy selection.",
      },
      {
        q: "Will the formatting break when I paste?",
        a: "No. The text is cleaned so it pastes neatly into docs and editors.",
      },
      {
        q: "Is copying transcripts allowed?",
        a: "You are responsible for ensuring you have the rights to use any content you copy or export.",
      },
    ],
    related: ["youtube-to-text", "youtube-transcript-generator", "srt-to-txt"],
  },
  {
    slug: "youtube-transcript-download",
    title: "Download YouTube Transcript — TXT, SRT, VTT, MD",
    metaDescription:
      "Download YouTube transcripts as TXT, Markdown, SRT, or VTT files. Clean formatting, timestamps included, free and instant.",
    h1: "Download a YouTube Transcript",
    intro: [
      "Export any YouTube video's transcript as a file. LinkTranscript supports plain text, Markdown, SRT, and VTT, so you can take the transcript into your notes app, document, or video editor.",
      "Every download includes the video title, source URL, language, and the date it was generated, so your files stay organized and traceable.",
    ],
    sections: [
      {
        heading: "Four formats for four jobs",
        body: "TXT for quick reading and sharing, Markdown for docs and note apps, and SRT or VTT for subtitle workflows in editors and web players. Pick the one that fits where the transcript is going next.",
      },
      {
        heading: "Timestamps where it matters",
        body: "SRT and VTT carry precise cue timings. For TXT and Markdown you can choose whether to include timestamps before you export.",
      },
      {
        heading: "This is a transcript tool, not a video downloader",
        body: "LinkTranscript downloads the text of a video — its captions — not the video file itself. It is built for notes, research, and repurposing.",
      },
    ],
    faqs: [
      {
        q: "What file formats can I download?",
        a: "TXT, Markdown (.md), SRT, and VTT.",
      },
      {
        q: "Do downloads include timestamps?",
        a: "SRT and VTT always include cue times. TXT and Markdown include timestamps if the toggle is on when you export.",
      },
      {
        q: "Can I download the video itself?",
        a: "No. LinkTranscript only handles transcripts and text, not media files.",
      },
      {
        q: "Is there a watermark or limit?",
        a: "No watermarks. Single transcript downloads are free.",
      },
    ],
    related: ["srt-to-txt", "vtt-to-txt", "youtube-transcript-generator"],
  },
  {
    slug: "youtube-video-summary",
    title: "YouTube Video Summary — Get the Transcript to Summarize",
    metaDescription:
      "Get a clean transcript of any YouTube video so you can summarize it fast. Copy or export the text and drop it into your favorite AI tool. Free, no signup.",
    h1: "Summarize Any YouTube Video",
    intro: [
      "Skip the 40-minute watch. LinkTranscript pulls a video's full transcript in seconds, so you can read it, search it, and turn it into a summary in a fraction of the time.",
      "It is free and needs no signup. Copy the clean transcript or export it, then paste it into your favorite AI assistant (like ChatGPT or Claude) to generate a summary. One-click built-in summaries are coming soon.",
    ],
    sections: [
      {
        heading: "From a long video to the key points",
        body: "A transcript lets you skim what would otherwise take 40 minutes to watch. Read the highlights, search for the part you need, and pull exact quotes — far faster than scrubbing the timeline.",
      },
      {
        heading: "Summary-ready text for any AI tool",
        body: "Copy the clean transcript or export it as TXT or Markdown, then paste it into the AI tool you already use. Because you control the prompt, you decide whether you want a one-paragraph summary, bullet notes, or key takeaways.",
      },
      {
        heading: "Verify with one click",
        body: "Every line keeps a clickable timestamp, so you can jump back to the exact moment behind any point to confirm the context before you rely on it.",
      },
    ],
    faqs: [
      {
        q: "How do I summarize a YouTube video?",
        a: "Paste the URL to get the transcript, copy or export the clean text, then paste it into an AI assistant and ask for a summary.",
      },
      {
        q: "Is it free?",
        a: "Yes. Getting and exporting the transcript is free and requires no account.",
      },
      {
        q: "Are built-in AI summaries available?",
        a: "Not yet — one-click summaries, notes, and takeaways are on the roadmap. For now the transcript gives you summary-ready text for any AI tool.",
      },
      {
        q: "Can I summarize long videos?",
        a: "Yes. The full transcript is extracted regardless of length, so you have everything you need to summarize.",
      },
    ],
    related: ["youtube-transcript-to-notes", "transcript-to-blog-post", "youtube-transcript-generator"],
  },
  {
    slug: "youtube-transcript-to-notes",
    title: "YouTube Transcript to Notes — Bullet Notes & Study Guides",
    metaDescription:
      "Turn any YouTube video into clean, study-ready transcript text you can shape into notes. Export Markdown for Notion or Obsidian. Free, no signup.",
    h1: "Turn a YouTube Transcript into Notes",
    intro: [
      "Convert a video into clean, study-ready text in seconds. LinkTranscript extracts the full transcript so you can highlight the important parts, search for key terms, and build notes without rewatching.",
      "It is built for students and researchers. Export the transcript as Markdown into Notion or Obsidian, or paste it into your favorite AI tool to draft bullet notes and study guides. Built-in note generation is coming soon.",
    ],
    sections: [
      {
        heading: "Read, search, and pull what matters",
        body: "Instead of scrubbing a lecture, search the transcript for the term you need and copy the exact passage. Clickable timestamps let you jump back to the source moment to double-check.",
      },
      {
        heading: "Markdown that fits your note app",
        body: "Export the transcript as Markdown and drop it straight into Notion, Obsidian, or any editor, with the source video linked for reference. From there it is easy to restructure into your own notes.",
      },
      {
        heading: "Notes-ready text for any AI tool",
        body: "Want bullet notes or a study guide quickly? Paste the exported transcript into the AI assistant you already use and prompt it however you like. One-click note formats are on the roadmap.",
      },
    ],
    faqs: [
      {
        q: "How do I turn a video into notes?",
        a: "Get the transcript, export it as Markdown or copy the clean text, then organize it in your note app or paste it into an AI tool for bullet notes.",
      },
      {
        q: "Can I edit the text?",
        a: "Yes. The transcript is plain text and Markdown, so you can edit it anywhere.",
      },
      {
        q: "Are built-in study guides available?",
        a: "Not yet — automatic notes and study guides are coming soon. Today you get clean, notes-ready transcript text.",
      },
      {
        q: "Will the notes include timestamps?",
        a: "The transcript includes clickable timestamps you can keep or toggle off before exporting.",
      },
    ],
    related: ["youtube-video-summary", "youtube-transcript-generator", "transcript-to-blog-post"],
  },
  {
    slug: "transcript-to-blog-post",
    title: "Transcript to Blog Post — Turn Videos into Articles",
    metaDescription:
      "Turn any video into a clean transcript you can shape into a blog post. Copy or export the text and draft your article fast. Free, no signup.",
    h1: "Turn a Transcript into a Blog Post",
    intro: [
      "Repurpose a video into a written article. LinkTranscript extracts the full transcript in seconds, giving you the raw material — quotes, structure, and key points — to write a blog post fast.",
      "It is the fast lane from a talk, interview, or tutorial to publishable text. Copy or export the transcript and draft from it, or paste it into your favorite AI tool to generate a first draft. Built-in drafting is coming soon.",
    ],
    sections: [
      {
        heading: "All the source material, instantly",
        body: "A clean transcript hands you everything that was said — accurate quotes, the flow of the argument, and the details you would otherwise have to re-watch to capture.",
      },
      {
        heading: "Draft-ready text for any AI tool",
        body: "Export the transcript as Markdown and paste it into the AI assistant you already use with a prompt like 'turn this into a blog post.' You control the angle, tone, and structure.",
      },
      {
        heading: "From one video to many formats",
        body: "The same transcript can fuel a blog post, a LinkedIn post, and an X thread, so a single video powers a week of content.",
      },
    ],
    faqs: [
      {
        q: "How do I turn a video into a blog post?",
        a: "Get the transcript, export or copy the clean text, then write your article from it or paste it into an AI tool to draft one.",
      },
      {
        q: "Should I edit before publishing?",
        a: "Yes. Always review, add your perspective, and verify facts before publishing.",
      },
      {
        q: "Who owns the output?",
        a: "You are responsible for ensuring you have the rights to repurpose the source content.",
      },
      {
        q: "Is built-in drafting available?",
        a: "Not yet — one-click blog drafting is on the roadmap. Today you get clean, draft-ready transcript text for free.",
      },
    ],
    related: ["transcript-to-linkedin-post", "youtube-video-summary", "youtube-transcript-generator"],
  },
  {
    slug: "transcript-to-linkedin-post",
    title: "Transcript to LinkedIn Post — Draft Posts from Videos",
    metaDescription:
      "Turn a video transcript into the raw material for a LinkedIn post. Extract the transcript free, pull the best insight, and draft your post fast.",
    h1: "Turn a Transcript into a LinkedIn Post",
    intro: [
      "Pull the best insight out of a video and shape it into a professional LinkedIn post. LinkTranscript extracts the full transcript so you can find the standout line and quote it accurately.",
      "Copy or export the transcript, then write your post from it or paste it into your favorite AI tool with a prompt like 'draft a LinkedIn post from this.' Built-in post drafting is coming soon.",
    ],
    sections: [
      {
        heading: "Find the line worth posting",
        body: "Search the transcript for the moment that lands, copy the exact quote, and build your post around it. No re-watching to find that one great point.",
      },
      {
        heading: "Draft-ready for any AI tool",
        body: "Export the transcript and paste it into the AI assistant you already use. Because you write the prompt, you control the tone — professional, punchy, hashtag-free, whatever fits your feed.",
      },
      {
        heading: "Repurpose responsibly",
        body: "Your post is based on someone's video. Add your own take and make sure you have the right to share the underlying ideas.",
      },
    ],
    faqs: [
      {
        q: "How do I turn a video into a LinkedIn post?",
        a: "Get the transcript, find the best insight, and write your post from it — or paste the exported text into an AI tool to draft one.",
      },
      {
        q: "Can I control the tone?",
        a: "Yes. When you draft with your own AI tool, you write the prompt and set the tone.",
      },
      {
        q: "Is built-in drafting available?",
        a: "Not yet — one-click post drafting is on the roadmap. Today you get clean, draft-ready transcript text for free.",
      },
      {
        q: "Can I make an X thread too?",
        a: "Yes — the same transcript works as source material for an X/Twitter thread.",
      },
    ],
    related: ["transcript-to-blog-post", "youtube-video-summary", "youtube-transcript-generator"],
  },
  {
    slug: "vtt-to-txt",
    title: "VTT to TXT — Convert Captions to Clean Text",
    metaDescription:
      "Convert WebVTT captions to clean plain text. Get a transcript from any YouTube video and export it as VTT or TXT instantly.",
    h1: "VTT to TXT Converter",
    intro: [
      "Need clean text instead of caption cues? LinkTranscript extracts a video's captions and lets you export them as either WebVTT or plain TXT, so you can move between subtitle and text workflows easily.",
      "Paste a YouTube link to generate the captions, then export to the format you need.",
    ],
    sections: [
      {
        heading: "From cue timings to readable prose",
        body: "VTT files are great for players but awkward to read. Exporting to TXT strips the cue syntax and gives you clean, continuous text — with or without timestamps.",
      },
      {
        heading: "Keep both formats",
        body: "Export VTT for your web player and TXT for your notes from the same transcript. No need to convert files by hand.",
      },
      {
        heading: "Clean by default",
        body: "Repeated whitespace is collapsed and lines are tidied, so the text you get is ready to use immediately.",
      },
    ],
    faqs: [
      {
        q: "How do I convert VTT to TXT?",
        a: "Generate a transcript from the video, then click the TXT export button. You can also export VTT.",
      },
      {
        q: "Can I upload my own VTT file?",
        a: "Direct file upload is on the roadmap. For now, generate captions from a YouTube link.",
      },
      {
        q: "Will timestamps be removed?",
        a: "TXT export can include or exclude timestamps based on the toggle.",
      },
      {
        q: "Is it free?",
        a: "Yes, exporting transcripts is free.",
      },
    ],
    related: ["srt-to-txt", "youtube-transcript-download", "youtube-to-text"],
  },
  {
    slug: "srt-to-txt",
    title: "SRT to TXT — Convert Subtitles to Plain Text",
    metaDescription:
      "Convert SRT subtitles to clean plain text. Generate a transcript from any YouTube video and export as SRT or TXT in one click.",
    h1: "SRT to TXT Converter",
    intro: [
      "Turn subtitle files into clean, readable text. LinkTranscript extracts a video's captions and exports them as SRT for editors or TXT for reading and notes.",
      "Paste a YouTube URL to generate the captions, then export the format you need.",
    ],
    sections: [
      {
        heading: "Subtitles to text, cleanly",
        body: "SRT files mix numbers, timecodes, and text. Exporting to TXT removes the scaffolding and leaves you with clean prose you can actually read and reuse.",
      },
      {
        heading: "One transcript, two outputs",
        body: "Export SRT for your video editor and TXT for your document from a single extraction — no manual cleanup required.",
      },
      {
        heading: "Accurate cue timing",
        body: "When you do need SRT, the export carries precise start and end times for each line, ready for subtitle workflows.",
      },
    ],
    faqs: [
      {
        q: "How do I convert SRT to TXT?",
        a: "Generate the transcript, then click TXT export. SRT export is also available.",
      },
      {
        q: "Can I upload an existing SRT file?",
        a: "File upload is planned. Today you generate captions from a YouTube link.",
      },
      {
        q: "Does TXT keep timestamps?",
        a: "Optionally — toggle timestamps before exporting TXT.",
      },
      {
        q: "Is this free?",
        a: "Yes. Single transcript exports are free.",
      },
    ],
    related: ["vtt-to-txt", "youtube-transcript-download", "copy-youtube-transcript"],
  },
  {
    slug: "video-to-markdown",
    title: "Video to Markdown — Export Transcripts as Markdown",
    metaDescription:
      "Convert any YouTube video into clean Markdown. Generate the transcript and export formatted Markdown for Notion, Obsidian, and docs.",
    h1: "Convert Video to Markdown",
    intro: [
      "Get a video's transcript as clean Markdown, ready to paste into Notion, Obsidian, or your docs. LinkTranscript formats the title, source, and body so it slots straight into your knowledge base.",
      "Paste a YouTube link, and export Markdown with or without timestamps.",
    ],
    sections: [
      {
        heading: "Markdown that fits your workflow",
        body: "The export includes a heading, source metadata, and a cleanly formatted body. Timestamps render as inline code so they stay readable in any Markdown viewer.",
      },
      {
        heading: "Built for note apps",
        body: "Notion, Obsidian, Bear, and most editors speak Markdown natively. Paste once and your transcript is structured, linked, and searchable.",
      },
      {
        heading: "Timestamps and metadata included",
        body: "The Markdown export keeps the video title, source link, language, and date, plus optional timestamps — so each document is self-contained and traceable.",
      },
    ],
    faqs: [
      {
        q: "What's in the Markdown export?",
        a: "A title heading, channel and source links, language, generation date, and the formatted transcript body.",
      },
      {
        q: "Can I exclude timestamps?",
        a: "Yes. Toggle timestamps off before exporting.",
      },
      {
        q: "Does it work with Notion and Obsidian?",
        a: "Yes. The Markdown pastes cleanly into both.",
      },
      {
        q: "Is it free?",
        a: "Yes, Markdown export is free.",
      },
    ],
    related: ["youtube-transcript-to-notes", "youtube-to-text", "youtube-transcript-download"],
  },
  {
    slug: "playlist-transcript-generator",
    title: "Playlist Transcript Generator — Bulk Transcripts (Coming Soon)",
    metaDescription:
      "Generate transcripts for an entire YouTube playlist. Bulk extraction is coming soon — extract single-video transcripts free today.",
    h1: "YouTube Playlist Transcript Generator",
    intro: [
      "Want transcripts for a whole playlist at once? Bulk playlist extraction is on the LinkTranscript roadmap. In the meantime, you can generate a clean transcript for any single video right now.",
      "Paste any video URL below to get started, and check back as playlist support rolls out.",
    ],
    sections: [
      {
        heading: "What's coming",
        body: "Playlist support will let you paste a playlist link and receive transcripts for every video, with combined export options for research and content workflows.",
      },
      {
        heading: "Use it today, one video at a time",
        body: "All the core features — timestamps, search, copy, and TXT/Markdown/SRT/VTT export — already work for individual videos. Playlist mode simply scales that up.",
      },
      {
        heading: "Built to scale",
        body: "The extraction service is designed so batch and playlist processing can be added without changing how single transcripts work.",
      },
    ],
    faqs: [
      {
        q: "Can I transcribe a full playlist now?",
        a: "Not yet — playlist transcripts are coming soon. You can transcribe videos individually today.",
      },
      {
        q: "Will bulk export be supported?",
        a: "Yes, combined and per-video exports are planned for playlist mode.",
      },
      {
        q: "How do I get notified?",
        a: "Watch the roadmap in the footer; saved history and playlist support are listed there.",
      },
      {
        q: "Is single-video extraction free?",
        a: "Yes, and it requires no signup.",
      },
    ],
    related: ["youtube-transcript-generator", "youtube-to-text", "youtube-transcript-download"],
  },
];

export function getSeoPage(slug: string): SeoPage | undefined {
  return SEO_PAGES.find((p) => p.slug === slug);
}

export function relatedPages(slugs: string[]): { slug: string; h1: string }[] {
  return slugs
    .map((s) => SEO_PAGES.find((p) => p.slug === s))
    .filter((p): p is SeoPage => !!p)
    .map((p) => ({ slug: p.slug, h1: p.h1 }));
}
