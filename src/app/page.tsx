import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-body">Welcome</h1>
        <p className="mt-2 text-muted">
          Create a new intelligence brief or continue where you left off.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Link
          href="/upload"
          className="group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand bg-brand-light p-8 text-center transition-all hover:border-solid hover:shadow-md"
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand transition-transform group-hover:scale-110">
            <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-brand">New Intelligence Brief</span>
        </Link>

        <div className="col-span-1 md:col-span-2 rounded-lg border border-border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
            Past Briefs
          </h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-subtle">
              <svg className="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-sm text-muted">No briefs yet. Start by uploading an RFP.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
