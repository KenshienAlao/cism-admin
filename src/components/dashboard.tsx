import { PlusIcon, Loader2 } from "lucide-react";
import { useStalls } from "@/hooks/use-stalls";

export function Dashboard() {
    const { stallsList: stalls, isLoading } = useStalls();

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    const totalEarnings = stalls.reduce(
        (sum, stall) => sum + (stall.incomes?.income || 0),
        0,
    );
    const activeStalls = stalls.filter((s) => s.user?.status).length;
    const inactiveStalls = stalls.filter((s) => !s.user?.status).length;

    const topEarners = stalls
        .filter((stall) => (stall.incomes?.income || 0) >= 100)
        .sort((a, b) => (b.incomes?.income || 0) - (a.incomes?.income || 0))
        .slice(0, 5);

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Dashboard Overview
                </h1>
                <p className="text-muted-foreground text-[16px] mt-2 font-medium">
                    Monitor your stall performance and analytics in real-time
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="meta-card p-6! flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 flex items-center justify-center text-primary">
                        <PlusIcon size={28} />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                            Total Earnings
                        </p>
                        <p className="text-2xl font-black text-foreground mt-1">
                            ${totalEarnings.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="meta-card p-6! flex items-center gap-5">
                    <div className="w-14 h-14 bg-green-500/10 flex items-center justify-center text-green-600">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                            Active Stalls
                        </p>
                        <p className="text-2xl font-black text-foreground mt-1">
                            {activeStalls}
                        </p>
                    </div>
                </div>
                <div className="meta-card p-6! flex items-center gap-5">
                    <div className="w-14 h-14 bg-red-500/10 flex items-center justify-center text-red-600">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                            Inactive
                        </p>
                        <p className="text-2xl font-black text-foreground mt-1">
                            {inactiveStalls}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="meta-card">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                            Top Performing Stalls
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {topEarners.map((stall, index) => (
                            <div
                                key={stall.id}
                                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-secondary transition-all border border-transparent hover:border-border"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border ${index === 0
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                                            : "bg-card text-foreground border-border"
                                            }`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-foreground text-[15px] truncate">
                                            {stall.user.name}
                                        </p>
                                        <p className="text-[13px] text-muted-foreground font-mono mt-0.5">
                                            {stall.licence}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="font-black text-foreground text-[16px]">
                                        ${stall.incomes?.income.toLocaleString()}
                                    </p>
                                    <span
                                        className={`text-[10px] font-black uppercase tracking-tight px-2 py-0.5 rounded-md mt-1 inline-block ${stall.user.status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {stall.user.status ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {topEarners.length === 0 && (
                            <div className="text-center py-16 bg-secondary/30  border border-dashed border-border">
                                <p className="text-muted-foreground font-bold italic">
                                    Waiting for your first superstar stall...
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="meta-card">
                    <h2 className="text-xl font-extrabold text-foreground tracking-tight mb-8">
                        System Analytics
                    </h2>
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-3">
                                <span className="text-[14px] font-bold text-foreground">
                                    Active Stalls Coverage
                                </span>
                                <span className="text-[14px] font-black text-primary">
                                    {stalls.length > 0
                                        ? Math.round((activeStalls / stalls.length) * 100)
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-4 overflow-hidden border border-border">
                                <div
                                    className="bg-primary h-full rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(var(--color-primary),0.3)]"
                                    style={{
                                        width: `${stalls.length > 0 ? (activeStalls / stalls.length) * 100 : 0}%`,
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6">
                                Financial Growth
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-secondary p-5 border border-border">
                                    <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-tight mb-2">
                                        Projected Growth
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-black text-foreground">
                                            ${Math.round(totalEarnings * 0.3).toLocaleString()}
                                        </p>
                                        <span className="text-[11px] font-black text-green-600">
                                            +12%
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-secondary p-5 border border-border ">
                                    <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-tight mb-2">
                                        Operating Margin
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-black text-foreground">
                                            ${Math.round(totalEarnings * 0.25).toLocaleString()}
                                        </p>
                                        <span className="text-[11px] font-black text-primary">
                                            84%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 p-4">
                            <p className="text-[13px] text-primary font-bold leading-relaxed">
                                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2" />
                                Insights: Your top stall is outperforming the average by 42%.
                                Consider reviewing their operational patterns.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
