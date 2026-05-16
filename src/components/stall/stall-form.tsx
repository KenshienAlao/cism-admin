"use client"
import React, { useRef, useState, useEffect } from 'react';
import { Save, X, PlusIcon, Camera, ImagePlus, Loader2, ChevronDown } from 'lucide-react';
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
    const [stalls, setStalls] = useState<StallModel>(
        initialData
            ? { ...initialData, user: { ...initialData.user, role: initialData.user.role || "STALL" } }
            : initStalls
    );
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            setStalls({
                ...initialData,
                user: { ...initialData.user, role: initialData.user.role || "STALL" }
            });
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
        <form onSubmit={handleSubmit} className="meta-card p-4 sm:p-8 md:p-10 mb-6 sm:mb-8">
            <fieldset disabled={isSubmitting}>
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                            {initialData?.id ? 'Edit Stall' : 'Create New Stall'}
                        </h2>
                        <p className="text-muted-foreground text-[13px] sm:text-[14px] mt-1">
                            {initialData?.id ? 'Update your stall information below' : 'Fill in the details to register a new stall'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-1.5 sm:p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground shrink-0"
                    >
                        <X size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-[13px] sm:text-[14px] font-bold text-foreground mb-2 px-1">
                                    Stall Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={stalls.user.name || ""}
                                    onChange={(e) => setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, name: e.target.value } }))}
                                    className="meta-input text-[14px] sm:text-[16px]"
                                    placeholder="e.g., Food Stall #1"
                                />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-[13px] sm:text-[14px] font-bold text-foreground mb-2 px-1">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="role"
                                        value={stalls.user.role || "STALL"}
                                        onChange={(e) => setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, role: e.target.value as "STALL" | "BUSINESS" } }))}
                                        className="meta-input text-[14px] sm:text-[16px] appearance-none pr-10"
                                    >
                                        <option value="STALL">STALL</option>
                                        <option value="BUSINESS">BUSINESS</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                        <ChevronDown size={20} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] sm:text-[14px] font-bold text-foreground mb-2 px-1">
                                    Service Hours
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="relative">
                                        <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[11px] sm:text-[12px] font-bold text-muted-foreground uppercase">Open</span>
                                        <input
                                            type="time"
                                            value={stalls.user.openAt}
                                            onChange={(e) => setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, openAt: e.target.value } }))}
                                            className="meta-input pl-14 sm:pl-16! py-2.5 sm:py-3! text-[14px] sm:text-[16px]"
                                        />
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[11px] sm:text-[12px] font-bold text-muted-foreground uppercase">Close</span>
                                        <input
                                            type="time"
                                            value={stalls.user.closeAt}
                                            onChange={(e) => setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, closeAt: e.target.value } }))}
                                            className="meta-input pl-14 sm:pl-16! py-2.5 sm:py-3! text-[14px] sm:text-[16px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor='image' className="block text-[13px] sm:text-[14px] font-bold text-foreground mb-2 px-1">
                                Stall Image
                            </label>
                            <input
                                id='image'
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
                                        
                                        {/* Floating Remove Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImagePreview(null);
                                                setStalls((prev: StallModel) => ({ ...prev, user: { ...prev.user, image: null as any } }));
                                            }}
                                            className="absolute top-4 right-4 z-10 bg-destructive text-destructive-foreground p-2 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-white/20"
                                            title="Remove Image"
                                        >
                                            <X size={18} />
                                        </button>

                                        {/* Center Change Overlay */}
                                        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    fileInputRef.current?.click();
                                                }}
                                                className="bg-card/90 backdrop-blur-md p-3 px-5 rounded-2xl shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:bg-card border border-white/10"
                                            >
                                                <Camera className="text-primary" size={20} />
                                                <span className="text-sm font-bold text-foreground">Change Photo</span>
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
                            value={stalls.user.description || ""}
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
