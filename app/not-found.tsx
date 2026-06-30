import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-8 text-sm font-medium text-background transition-all duration-300 hover:shadow-2xl"
      >
        Go back home
      </Link>
    </div>
  );
}
