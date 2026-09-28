interface JobSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function JobSearch({
    value,
    onChange,
}: JobSearchProps) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                <svg
                    className="h-5 w-5 text-slate-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                </svg>
            </div>

            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search jobs by title or company..."
                className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
        </div>
    );
}