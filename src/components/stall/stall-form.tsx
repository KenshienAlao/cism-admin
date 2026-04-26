"use client"
import React, { useRef, useState, useEffect } from 'react';
import { Save, X, PlusIcon, Camera, ImagePlus, Loader2 } from 'lucide-react';
import { initStalls, StallModel } from '@/model/stall.model';
import { notifyError } from '@/lib/toast';
import Image from 'next/image';
import { CreateStallShema } from '@/validation/stall.validation';

interface StallFormProps {
    initialData?: StallModel;
    onSubmit: (data: StallModel) => Promise<void>;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function StallForm({ initialData, onSubmit, onCancel, isSubmitting }: StallFormProps) {
    const [stalls, setStalls] = useState<StallModel>(initialData || initStalls);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setStalls(initialData);
            if (initialData.user.image) {
                const image = initialData.user.image;
                setImagePreview(typeof image === 'string' ? image : URL.createObjectURL(image));
            }
        }
    }, [initialData]);

    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
        if (file.size > MAX_FILE_SIZE) {
            notifyError("File size must be less than 2MB");
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            notifyError("Only JPG, PNG, and WebP images are allowed");
            return;
        }
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, image: file } }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const valid = CreateStallShema.safeParse(stalls.user);
        if (!valid.success) {
            notifyError(valid.error.issues[0].message);
            return;
        }
        await onSubmit(stalls);
    }

    return (
        <form onSubmit={handleSubmit} className="meta-card mb-8">
            <fieldset disabled={isSubmitting}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
                            {initialData?.id ? 'Edit Stall' : 'Create New Stall'}
                        </h2>
                        <p className="text-muted-foreground text-[14px] mt-1">
                            {initialData?.id ? 'Update your stall information below' : 'Fill in the details to register a new stall'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-[14px] font-bold text-foreground mb-2 px-1">
                                    Stall Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={stalls.user.name}
                                    onChange={(e) => setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, name: e.target.value } }))}
                                    className="meta-input"
                                    placeholder="e.g., Food Stall #1"
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-bold text-foreground mb-2 px-1">
                                    Service Hours
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-muted-foreground uppercase">Open</span>
                                        <input
                                            type="time"
                                            value={stalls.user.openAt}
                                            onChange={(e) => setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, openAt: e.target.value } }))}
                                            className="meta-input pl-16! py-3!"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] font-bold text-muted-foreground uppercase">Close</span>
                                        <input
                                            type="time"
                                            value={stalls.user.closeAt}
                                            onChange={(e) => setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, closeAt: e.target.value } }))}
                                            className="meta-input pl-16! py-3!"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label className="block text-[14px] font-bold text-foreground mb-2 px-1">
                                Stall Image
                            </label>
                            <input
                                ref={fileInputRef}
                                type='file'
                                accept='image/jpeg,image/png,image/webp'
                                className="hidden"
                                onChange={handleAddImage}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative flex-1 min-h-50 bg-secondary/50 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-all group overflow-hidden"
                            >
                                {imagePreview ? (
                                    <>
                                        <Image
                                            src={imagePreview}
                                            alt="Stall Preview"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="bg-card p-3 rounded-xl shadow-xl transform scale-90 group-hover:scale-100 transition-transform flex items-center gap-2">
                                                <Camera className="text-foreground" size={20} />
                                                <span className="text-sm font-bold text-foreground">Change Image</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="bg-card p-4 rounded-2xl shadow-sm border border-border group-hover:scale-110 transition-transform">
                                            <ImagePlus size={32} className="text-primary" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-foreground">Add Cover Photo</p>
                                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WebP (Max 2MB)</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-[14px] font-bold text-foreground mb-2 px-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={stalls.user.description}
                            onChange={(e) => setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, description: e.target.value } }))}
                            className="meta-input min-h-30 resize-none"
                            rows={4}
                            placeholder="What's your stall about?"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="meta-button flex-1"
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : initialData?.id ? <Save size={20} /> : <PlusIcon size={20} />}
                                <span>{isSubmitting ? 'Saving...' : initialData?.id ? 'Update Stall' : 'Create Stall'}</span>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="meta-button-secondary flex-1"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <X size={20} />
                                <span>Cancel</span>
                            </div>
                        </button>
                    </div>

                    {!initialData?.id && (
                        <div className="bg-secondary/50 border border-border rounded-xl p-4 flex items-start gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <PlusIcon size={16} className="text-primary" />
                            </div>
                            <p className="text-[13px] text-muted-foreground leading-relaxed">
                                <strong className="text-foreground">Heads up!</strong> Upon creation, a unique license key and secure password will be automatically generated for this stall. You can manage these credentials later.
                            </p>
                        </div>
                    )}
                </div>
            </fieldset>
        </form>
    );
}
