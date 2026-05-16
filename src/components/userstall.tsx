import { StallModel } from '@/model/stall.model';
import { Edit2, Eye, EyeOff, Trash2 } from 'lucide-react';

interface UserstallProps {
    stallsList: StallModel[];
    visiblePasswordId: string | null;
    setVisiblePasswordId: (value: string | null) => void;
    handleEdit: (id: string | undefined) => void;
    onDeleteStall: (id: string | undefined) => void;
}

export default function Userstall({ stallsList, visiblePasswordId, setVisiblePasswordId, handleEdit, onDeleteStall }: UserstallProps) {
    return (
        <tbody className="divide-y divide-border">
            {stallsList.map((stall, idx) => {
                if (!stall.user) return null; // Skip stalls with no user data
                const isPasswordVisible = visiblePasswordId === stall.id;
                const newLocal = "text-[13px] text-muted-foreground line-clamp-1 max-w-50";
                return (
                    <tr key={`${stall.user.id}-${idx}`} className="group hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-4">
                                {stall.user?.image ? (
                                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border">
                                        <img src={stall.user.image as string} alt={stall.user.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center border border-border">
                                        <span className="text-foreground font-bold text-lg">{stall.user.name.charAt(0)}</span>
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="font-bold text-[15px] text-foreground">{stall.user.name}</span>
                                    {stall.user.description && (
                                        <span className={newLocal}>
                                            {stall.user.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight uppercase border ${stall.user.status
                                ? 'bg-green-50 text-green-700 border-green-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${stall.user.status ? 'bg-green-600' : 'bg-red-600'}`} />
                                {stall.user.status ? "Active" : "Inactive"}
                            </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-[15px] font-bold text-foreground">
                                $ {stall.incomes?.income?.toLocaleString() ?? 0}
                            </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 sm:py-5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1 sm:gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(stall.id)}
                                    className="p-1.5 sm:p-2 text-foreground hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-border"
                                    title="Edit Stall"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm(`Are you sure you want to delete "${stall.user.name}"?`)) {
                                            onDeleteStall(stall.id);
                                        }
                                    }}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                    title="Delete Stall"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
}