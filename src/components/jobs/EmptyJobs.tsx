export default function EmptyJobs() {
    return (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <span className="text-xl">🔎</span>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No jobs found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We couldn't find any jobs matching your current search or filters.
                Try changing your search criteria.
            </p>
        </div>
    );
}