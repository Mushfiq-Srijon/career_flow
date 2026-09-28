import { BD_DIVISIONS } from "@/constants/divisions";

interface JobFiltersProps {
    location: string;
    minSalary: string;
    maxSalary: string;
    onLocationChange: (value: string) => void;
    onMinSalaryChange: (value: string) => void;
    onMaxSalaryChange: (value: string) => void;
    onClear: () => void;
}

export default function JobFilters({
    location,
    minSalary,
    maxSalary,
    onLocationChange,
    onMinSalaryChange,
    onMaxSalaryChange,
    onClear,
}: JobFiltersProps) {
    const hasFilters = location || minSalary || maxSalary;

    return (
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Filters</h2>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="mt-6 space-y-6">
                {/* Location */}
                <div>
                    <label
                        htmlFor="location"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Location
                    </label>

                    <select
                        id="location"
                        value={location}
                        onChange={(event) => onLocationChange(event.target.value)}
                        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    >
                        <option value="">All divisions</option>

                        {BD_DIVISIONS.map((division) => (
                            <option key={division} value={division}>
                                {division}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Salary */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Salary range
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label
                                htmlFor="min-salary"
                                className="sr-only"
                            >
                                Minimum salary
                            </label>

                            <input
                                id="min-salary"
                                type="number"
                                min="0"
                                value={minSalary}
                                onChange={(event) =>
                                    onMinSalaryChange(event.target.value)
                                }
                                placeholder="Min"
                                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="max-salary"
                                className="sr-only"
                            >
                                Maximum salary
                            </label>

                            <input
                                id="max-salary"
                                type="number"
                                min="0"
                                value={maxSalary}
                                onChange={(event) =>
                                    onMaxSalaryChange(event.target.value)
                                }
                                placeholder="Max"
                                className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                        Enter salary amounts in BDT.
                    </p>
                </div>
            </div>
        </aside>
    );
}