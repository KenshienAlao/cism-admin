"use client"
import React, { useState } from 'react';
import { Search, Eye, EyeOff, Copy, Check, Filter, Loader2, ShieldCheck, Key, User } from 'lucide-react';
import { useStalls } from '@/hooks/use-stalls';

export function StallOverview() {
    const { stallsList, isLoading } = useStalls();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const togglePasswordVisibility = (stallId: string) => {
        const newVisible = new Set(visiblePasswords);
        if (newVisible.has(stallId)) {
            newVisible.delete(stallId);
        } else {
            newVisible.add(stallId);
        }
        setVisiblePasswords(newVisible);
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const filteredStalls = stallsList.filter(stall => {
        const matchesSearch = stall.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stall.licence.toLowerCase().includes(searchTerm.toLowerCase());
        const status = stall.user.status ? 'active' : 'inactive';
        const matchesFilter = filterStatus === 'all' || status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-secondary">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-full bg-secondary p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-[28px] font-bold text-foreground tracking-tight">Stall Credentials Overview</h1>
                    <p className="text-muted-foreground text-[16px] mt-1">Access and manage security credentials for all registered stalls.</p>
                </div>

                {/* Filter Section - Clean Modern Style */}
                <div className="bg-card border border-border p-4 mb-6 flex flex-col md:flex-row gap-4 shadow-sm">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search by stall name or license..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none transition-all text-[15px] text-foreground"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-muted-foreground" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="bg-secondary border border-border px-4 py-2.5 text-[15px] font-semibold text-foreground outline-none cursor-pointer hover:bg-accent transition-colors"
                        >
                            <option value="all">All Stalls</option>
                            <option value="active">Active Stalls</option>
                            <option value="inactive">Inactive Stalls</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {filteredStalls.map((stall) => (
                        <div key={stall.id} className="bg-card border border-border shadow-sm flex flex-col lg:flex-row overflow-hidden">
                            {/* Stall Profile Section */}
                            <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-border p-6 bg-secondary/30">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative w-24 h-24 mb-4 border-4 border-card shadow-md">
                                        {stall.user.image ? (
                                            <img
                                                src={stall.user.image as string}
                                                alt={stall.user.name}
                                                width={100}
                                                height={100}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold">
                                                {stall.user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground line-clamp-1">{stall.user.name}</h3>
                                    <p className="mt-4 text-[14px] text-muted-foreground line-clamp-2 italic">
                                        {stall.user.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            {/* Credentials Section */}
                            <div className="flex-1 p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6">
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShieldCheck size={16} className="text-primary" />
                                            <label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">License Key</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-secondary px-4 py-3 border border-border font-mono text-[15px] text-foreground">
                                                {stall.licence}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(stall.licence, `lic-${stall.id}`)}
                                                className="p-3 bg-secondary hover:bg-accent text-foreground transition-colors"
                                                title="Copy License"
                                            >
                                                {copiedField === `lic-${stall.id}` ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Key size={16} className="text-primary" />
                                            <label className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Security Password</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-secondary px-4 py-3 border border-border font-mono text-[15px] text-foreground">
                                                {visiblePasswords.has(stall.id!) ? stall.password : '••••••••••••••••'}
                                            </div>
                                            <button
                                                onClick={() => togglePasswordVisibility(stall.id!)}
                                                className="p-3 bg-secondary hover:bg-accent text-foreground transition-colors"
                                            >
                                                {visiblePasswords.has(stall.id!) ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                            <button
                                                onClick={() => copyToClipboard(stall.password, `pass-${stall.id}`)}
                                                className="p-3 bg-secondary hover:bg-accent text-foreground transition-colors"
                                                title="Copy Password"
                                            >
                                                {copiedField === `pass-${stall.id}` ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-secondary p-6 border-l-4 border-primary">
                                    <h4 className="text-[14px] font-bold text-foreground uppercase mb-4 tracking-tight">System Metadata</h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-muted-foreground">Total Revenue</span>
                                            <span className="text-[16px] font-bold text-foreground">${stall.incomes?.income?.toLocaleString() ?? 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-muted-foreground">Service Status</span>
                                            <span className={`text-[13px] font-bold ${stall.user.status ? 'text-green-500' : 'text-red-500'}`}>
                                                {stall.user.status ? 'ONLINE' : 'OFFLINE'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[13px] text-muted-foreground">Internal UID</span>
                                            <span className="text-[11px] font-mono text-muted-foreground">{stall.user.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredStalls.length === 0 && (
                        <div className="bg-card border border-border p-20 text-center shadow-sm">
                            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                                <User size={40} className="text-muted-foreground" />
                            </div>
                            <h3 className="text-[20px] font-bold text-foreground">No matching stalls found</h3>
                            <p className="text-muted-foreground mt-2">Adjust your filters or try a different search term.</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-4 bg-primary/5 border border-primary/10">
                    <div className="flex gap-3">
                        <ShieldCheck className="text-primary shrink-0" size={20} />
                        <p className="text-[13px] text-foreground leading-relaxed">
                            <strong>Administrator Security Protocol:</strong> Access to these credentials is restricted to authorized personnel only. License keys and passwords should never be shared over unsecured channels. All credential access is logged by the system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
