"use client";
import { VALUES } from "@/config/app.config";
import { ADMIN_MENU } from "@/config/menu.config";
import { Menu, Plus, X } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    currentView: typeof VALUES[keyof typeof VALUES];
    onViewChange: (view: typeof VALUES[keyof typeof VALUES]) => void;
}

export function Sidebar({
    currentView,
    onViewChange,
}: SidebarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);

    const handleViewChange = (view: typeof VALUES[keyof typeof VALUES]) => {
        onViewChange(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <>

            <div className="lg:hidden fixed top-0 left-0 right-0 w-full bg-card/80 backdrop-blur-md text-foreground z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center border-b border-border">
                <button
                    onClick={() => setIsMobileMenuOpen((prev: boolean) => !prev)}
                    className="p-1.5 sm:p-2 hover:bg-secondary rounded-xl transition-all"
                    type="button"
                >
                    {isMobileMenuOpen ? (
                        <X size={20} className="sm:w-6 sm:h-6" />
                    ) : (
                        <Menu size={20} className="sm:w-6 sm:h-6" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 sm:w-72 bg-card text-foreground h-screen flex flex-col border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
            >
                <div className="p-5 sm:p-8 pt-20 lg:pt-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                            <Plus className="text-primary-foreground sm:w-6 sm:h-6 w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight truncate">Stall Manager</h1>
                            <p className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5 truncate">
                                Admin Suite
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 sm:px-4 space-y-1 sm:space-y-1.5">
                    {ADMIN_MENU.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleViewChange(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl transition-all group ${isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                                type="button"
                            >
                                <Icon size={18} className={`sm:w-5 sm:h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                                <span className="font-bold text-[14px] sm:text-[15px]">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 sm:p-6">
                    <div className="bg-secondary/50 rounded-2xl p-3 sm:p-4 border border-border">
                        <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-relaxed">
                            Logged in as <br />
                            <strong className="text-foreground text-[13px] sm:text-[14px]">Administrator</strong>
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
}