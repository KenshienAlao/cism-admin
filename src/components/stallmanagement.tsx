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
        const payload: UserModel = { ...stallData.user };

        if (editingStall?.id) {
            await updateStall({ id: editingStall.id, data: payload });
        } else {
            await createStall(payload);
        }
        handleCancel();
    };

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Stall Management</h1>
                    <p className="text-muted-foreground text-[16px] mt-2 font-medium">Create, update, and manage your commercial stalls</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="meta-button w-auto! flex items-center gap-2 shadow-lg shadow-primary/20"
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
        </div>
    );
}
