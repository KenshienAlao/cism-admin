"use client"
import React, { useState } from 'react';
import { Search, Eye, EyeOff, Copy, Check, Filter, Loader2, ShieldCheck, Key, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { useStalls } from '@/hooks/use-stalls';

export function StallOverview() {
    const { stallsList, isLoading, resetPassword } = useStalls();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [resettingId, setResettingId] = useState<string | null>(null);
    const [newPasswords, setNewPasswords] = useState<Record<string, string>>({});

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

    const handleResetPassword = async (stallId: string) => {
        if (!confirm("Are you sure you want to reset this stall's password? The current password will be invalidated.")) return;
        
        setResettingId(stallId);
        try {
            const result = await resetPassword(stallId);
            if (result && result.password) {
                setNewPasswords(prev => ({ ...prev, [stallId]: result.password }));
                // Automatically show the new password
                const newVisible = new Set(visiblePasswords);
                newVisible.add(stallId);
                setVisiblePasswords(newVisible);
            }
        } finally {
            setResettingId(null);
        }
    };

    const filteredStalls = stallsList.filter(stall => {
        if (!stall.user) return false;
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
        <div className="min-h-full bg-secondary p-4 sm:p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-[22px] sm:text-[28px] font-bold text-foreground tracking-tight">Stall Credentials Overview</h1>
                    <p className="text-muted-foreground text-[14px] sm:text-[16px] mt-1">Access and manage security credentials for all registered stalls.</p>
                </div>

                {/* Filter Section - Clean Modern Style */}
                <div className="bg-card border border-border p-3 sm:p-4 mb-6 flex flex-col md:flex-row gap-3 sm:gap-4 shadow-sm">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search by stall name or license..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 sm:pr-4 py-2.5 bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none transition-all text-[13px] sm:text-[15px] text-foreground"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-muted-foreground shrink-0" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="bg-secondary border border-border w-full sm:w-auto px-3 sm:px-4 py-2.5 text-[13px] sm:text-[15px] font-semibold text-foreground outline-none cursor-pointer hover:bg-accent transition-colors"
                        >
                            <option value="all">All Stalls</option>
                            <option value="active">Active Stalls</option>
                            <option value="inactive">Inactive Stalls</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    {filteredStalls.map((stall) => (
                        <div key={stall.id} className="bg-card border border-border shadow-sm flex flex-col lg:flex-row overflow-hidden">
                            {/* Stall Profile Section */}
                            <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-border p-4 sm:p-6 bg-secondary/30">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4 border-4 border-card shadow-md">
                                        {stall.user.image ? (
                                            <img
                                                src={stall.user.image as string}
                                                alt={stall.user.name}
                                                width={100}
                                                height={100}
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-2xl sm:text-3xl font-bold">
                                                {stall.user.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-1">{stall.user.name}</h3>
                                    <p className="mt-2 sm:mt-4 text-[13px] sm:text-[14px] text-muted-foreground line-clamp-2 italic">
                                        {stall.user.description || "No description provided."}
                                    </p>
                                </div>
                            </div>

                            {/* Credentials Section */}
                            <div className="flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShieldCheck size={16} className="text-primary" />
                                            <label className="text-[12px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider">License Key</label>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="flex-1 bg-secondary px-3 sm:px-4 py-2.5 sm:py-3 border border-border font-mono text-[13px] sm:text-[15px] text-foreground truncate">
                                                {stall.licence}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(stall.licence, `lic-${stall.id}`)}
                                                className="p-2.5 sm:p-3 bg-secondary hover:bg-accent text-foreground transition-colors shrink-0"
                                                title="Copy License"
                                            >
                                                {copiedField === `lic-${stall.id}` ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Key size={16} className="text-primary" />
                                            <label className="text-[12px] sm:text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Security Password</label>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <div className="flex-1 bg-secondary px-3 sm:px-4 py-2.5 sm:py-3 border border-border font-mono text-[13px] sm:text-[15px] text-foreground truncate relative">
                                                {newPasswords[stall.id!] ? (
                                                    <span className="text-primary font-bold">
                                                        {visiblePasswords.has(stall.id!) ? newPasswords[stall.id!] : '••••••••••••••••'}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground/50 italic">
                                                        •••••••••••••••• (Encrypted)
                                                    </span>
                                                )}
                                            </div>
                                            {newPasswords[stall.id!] && (
                                                <button
                                                    onClick={() => togglePasswordVisibility(stall.id!)}
                                                    className="p-2.5 sm:p-3 bg-secondary hover:bg-accent text-foreground transition-colors shrink-0"
                                                    title={visiblePasswords.has(stall.id!) ? "Hide Password" : "Show Password"}
                                                >
                                                    {visiblePasswords.has(stall.id!) ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            )}
                                            <button
                                                onClick={() => copyToClipboard(newPasswords[stall.id!] || "", `pass-${stall.id}`)}
                                                disabled={!newPasswords[stall.id!]}
                                                className={`p-2.5 sm:p-3 bg-secondary hover:bg-accent text-foreground transition-colors shrink-0 ${!newPasswords[stall.id!] ? 'opacity-20 cursor-not-allowed' : ''}`}
                                                title="Copy Password"
                                            >
                                                {copiedField === `pass-${stall.id}` ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleResetPassword(stall.id!)}
                                                disabled={resettingId === stall.id}
                                                className="p-2.5 sm:p-3 bg-primary/10 hover:bg-primary/20 text-primary transition-colors shrink-0"
                                                title="Reset Password"
                                            >
                                                {resettingId === stall.id ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                                            </button>
                                        </div>
                                        {newPasswords[stall.id!] && (
                                            <div className="mt-2 flex items-start gap-2 text-[11px] text-primary bg-primary/5 p-2 border border-primary/20 animate-pulse">
                                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                                <p><strong>NEW PASSWORD GENERATED:</strong> Please copy this password now. It will not be shown again after you refresh the page.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-secondary p-4 sm:p-6 border-l-4 border-primary">
                                    <h4 className="text-[13px] sm:text-[14px] font-bold text-foreground uppercase mb-3 sm:mb-4 tracking-tight">System Metadata</h4>
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-[12px] sm:text-[13px] text-muted-foreground">Total Revenue</span>
                                            <span className="text-[14px] sm:text-[16px] font-bold text-foreground truncate">${stall.incomes?.income?.toLocaleString() ?? 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-[12px] sm:text-[13px] text-muted-foreground">Service Status</span>
                                            <span className={`text-[12px] sm:text-[13px] font-bold shrink-0 ${stall.user.status ? 'text-green-500' : 'text-red-500'}`}>
                                                {stall.user.status ? 'ONLINE' : 'OFFLINE'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center gap-2">
                                            <span className="text-[12px] sm:text-[13px] text-muted-foreground">Internal UID</span>
                                            <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground truncate">{stall.user.id}</span>
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
