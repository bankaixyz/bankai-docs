import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-fd-muted-foreground">
          Bankai
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Public docs foundation for Bankai
        </h1>
        <p className="mt-6 text-base leading-7 text-fd-muted-foreground sm:text-lg">
          This repository hosts the public docs shell for product concepts, chain guidance, SDK
          entry points, and future API reference.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/docs"
            className="rounded-full border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-fd-accent"
          >
            Open docs
          </Link>
        </div>
      </div>
    </main>
  );
}
