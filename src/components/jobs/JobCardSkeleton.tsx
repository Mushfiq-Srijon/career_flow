export default function JobCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse">
                <div className="flex items-start justify-between gap-4">
                    <div className="w-full">
                        <div className="h-5 w-3/5 rounded bg-slate-200" />
                        <div className="mt-3 h-4 w-2/5 rounded bg-slate-200" />
                    </div>

                    <div className="h-7 w-20 rounded-lg bg-slate-200" />
                </div>

                <div className="mt-6 space-y-2">
                    <div className="h-3 rounded bg-slate-200" />
                    <div className="h-3 w-5/6 rounded bg-slate-200" />
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                    <div className="h-3 w-16 rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-32 rounded bg-slate-200" />
                </div>
            </div>
        </div>
    );
}