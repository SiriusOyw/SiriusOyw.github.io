'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mt-4 text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-foreground px-8 text-sm font-medium text-background transition-all duration-300 hover:shadow-2xl"
      >
        Try again
      </button>
    </div>
  );
}
