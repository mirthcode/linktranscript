import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResultView } from "@/components/result/ResultView";

export const metadata: Metadata = {
  title: "Transcript",
  robots: { index: false, follow: false },
};

export default function ResultPage({
  searchParams,
}: {
  searchParams: { url?: string };
}) {
  const url = searchParams.url?.trim();
  if (!url) redirect("/");
  return <ResultView url={url} />;
}
