"use client"
import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { StallModel, UserModel } from '@/model/stall.model';
import { useStalls } from '@/hooks/use-stalls';
import { StallForm } from './stall/stall-form';
import { StallList } from './stall/stall-list';

export function StallManagement() {
    const {
        stallsList,
        isLoading,
        createStall,
        updateStall,
        deleteStall,
        isCreating,
        isUpdating
    } = useStalls();

    const [showForm, setShowForm] = useState(false);
    const [editingStall, setEditingStall] = useState<StallModel | undefined>(undefined);
    const [createdCredentials, setCreatedCredentials] = useState<{ licence: string, password: string } | null>(null);

    const handleEdit = (id: string | undefined) => {
        if (!id) return;
        const stall = stallsList.find(s => s.id === id);
        if (stall) {
            setEditingStall(stall);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingStall(undefined);
    };

    const handleSubmit = async (stallData: StallModel) => {
        const {
            id: _id,
            stallId: _sid,
            createdAt: _ca,
            updatedAt: _ua,
            ...userData
        } = stallData.user;

        const payload = {
            ...userData,
            description: userData.description?.trim() || null,
            openAt: userData.openAt?.length === 5 ? `${userData.openAt}:00` : userData.openAt,
            closeAt: userData.closeAt?.length === 5 ? `${userData.closeAt}:00` : userData.closeAt,
        };

        if (editingStall?.id) {
            const res = await updateStall({ id: editingStall.id, data: payload as UserModel });
            if (res.success) handleCancel();
        } else {
            const result = await createStall(payload as UserModel);
            if (!result.success) return;

            const account = (result?.data as any)?.account;
            if (account?.licence && account?.password) {
                setCreatedCredentials({ licence: account.licence, password: account.password });
                setShowForm(false);
            } else {
                handleCancel();
            }
        }
    };


    return (
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Stall Management</h1>
                    <p className="text-muted-foreground text-[14px] sm:text-[16px] mt-1 sm:mt-2 font-medium">Create, update, and manage your commercial stalls</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="meta-button w-full sm:w-auto! flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                        <PlusIcon size={20} />
                        <span>Create New Stall</span>
                    </button>
                )}
            </div>

            {showForm && (
                <StallForm
                    initialData={editingStall}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isCreating || isUpdating}
                />
            )}

            <StallList
                stallsList={stallsList}
                isLoading={isLoading}
                onEdit={handleEdit}
                onDelete={(id) => id && deleteStall(id)}
            />

            {createdCredentials && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-300">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PlusIcon className="text-primary" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Stall Created!</h2>
                            <p className="text-muted-foreground mt-2">Credentials have been generated successfully.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase">License Key</label>
                                <div className="bg-secondary p-3 border border-border font-mono text-[15px] select-all">
                                    {createdCredentials.licence}
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-muted-foreground uppercase">Initial Password</label>
                                <div className="bg-secondary p-3 border border-border font-mono text-[15px] text-primary font-bold select-all">
                                    {createdCredentials.password}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-3">
                            <div className="text-yellow-600 shrink-0">⚠️</div>
                            <p className="text-[13px] text-yellow-700 leading-relaxed font-medium">
                                <strong>Important:</strong> Copy these credentials now. The password is encrypted and will <strong>never be shown again</strong> for security reasons.
                            </p>
                        </div>

                        <button
                            onClick={() => setCreatedCredentials(null)}
                            className="meta-button w-full mt-6"
                        >
                            I've saved the credentials
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
