"use client"
import React, { useState } from 'react';
import { PlusIcon, Store, SearchX } from 'lucide-react';
import { StallModel } from '@/model/stall.model';
import Userstall from '@/components/userstall';
import Loadingstalls from '@/components/ui/loadingstalls';

interface StallListProps {
    stallsList: StallModel[];
    isLoading: boolean;
    onEdit: (id: string | undefined) => void;
    onDelete: (id: string | undefined) => void;
}

export function StallList({ stallsList, isLoading, onEdit, onDelete }: StallListProps) {
    const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(null);
    const validStallsCount = stallsList.filter(s => s.user).length;
    const isEmpty = validStallsCount === 0 && !isLoading;

    return (
        <div className="bg-card border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">All Stalls</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-secondary/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                                Stall Details
                            </th>
                            <th className="px-6 py-4 text-left text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                                Earnings
                            </th>
                            <th className="px-6 py-4 text-right text-[12px] font-bold text-muted-foreground uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    {isLoading ? (
                        <tbody>
                            <tr>
                                <td colSpan={6} className="py-20">
                                    <Loadingstalls />
                                </td>
                            </tr>
                        </tbody>
                    ) : (
                        <>
                            <Userstall
                                stallsList={stallsList}
                                visiblePasswordId={visiblePasswordId}
                                setVisiblePasswordId={setVisiblePasswordId}
                                handleEdit={onEdit}
                                onDeleteStall={onDelete}
                            />

                            {isEmpty && (
                                <tbody>
                                    <tr>
                                        <td colSpan={6} className="py-24 text-center">
                                            <div className="relative inline-block mb-6">
                                                <div className="bg-secondary/50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-secondary/20">
                                                    <Store className="text-muted-foreground/60" size={36} strokeWidth={1.5} />
                                                </div>
                                                <div className="absolute -right-2 -bottom-2 bg-background border border-border p-1.5 rounded-xl shadow-sm">
                                                    <SearchX size={16} className="text-primary" />
                                                </div>
                                            </div>
                                            <div className="max-w-xs mx-auto">
                                                <h3 className="text-[18px] font-extrabold text-foreground tracking-tight">No Stalls Available</h3>
                                                <p className="text-muted-foreground text-[14px] mt-2 leading-relaxed font-medium">
                                                    It looks like there are no active stalls in the system yet.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </>
                    )}
                </table>
            </div>
        </div>
    );
}
