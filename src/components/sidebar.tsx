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

            <div className="lg:hidden fixed top-0 left-0 right-0 bg-card text-foreground z-50 px-6 py-4 flex items-center justify-between border-b border-border">
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight">Stall Manager</h1>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen((prev: boolean) => !prev)}
                    className="p-2 hover:bg-secondary rounded-xl transition-all"
                    type="button"
                >
                    {isMobileMenuOpen ? (
                        <X size={24} />
                    ) : (
                        <Menu size={24} />
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
        w-72 bg-card text-foreground h-screen flex flex-col border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
            >
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Plus className="text-primary-foreground" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight">Stall Manager</h1>
                            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-0.5">
                                Admin Suite
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    {ADMIN_MENU.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleViewChange(item.id)}
                                className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-xl transition-all group ${isActive
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                    }`}
                                type="button"
                            >
                                <Icon size={20} className={isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"} />
                                <span className="font-bold text-[15px]">{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-6">
                    <div className="bg-secondary/50 rounded-2xl p-4 border border-border">
                        <p className="text-[13px] text-muted-foreground leading-relaxed">
                            Logged in as <br />
                            <strong className="text-foreground">Administrator</strong>
                        </p>
                    </div>
                </div>
            </div>

        </>
    );
}