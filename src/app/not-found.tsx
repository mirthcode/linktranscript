import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-px py-24 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-neutral-600">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you
        back to transcribing.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back home
      </Link>
    </section>
  );
}
