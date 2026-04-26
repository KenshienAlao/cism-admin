"use client"
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
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

                            {stallsList.length === 0 && (
                                <tbody>
                                    <tr>
                                        <td colSpan={6} className="py-20 text-center">
                                            <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                <PlusIcon className="text-muted-foreground" size={32} />
                                            </div>
                                            <p className="text-foreground font-bold">No stalls found</p>
                                            <p className="text-muted-foreground text-sm mt-1">Get started by creating your first stall.</p>
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
