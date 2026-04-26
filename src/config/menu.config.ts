import { LayoutDashboard, List, Store } from "lucide-react";
import { VALUES } from "./app.config";

export const ADMIN_MENU = [
  {
    id: VALUES.DASHBOARD,
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: VALUES.MANAGE_STALLS,
    label: "Manage Stalls",
    icon: Store,
  },
  {
    id: VALUES.STALL_OVERVIEW,
    label: "Stall Overview",
    icon: List,
  },
];
