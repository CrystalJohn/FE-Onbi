import {
  Activity,
  Baby,
  LayoutDashboard,
  MessageSquareText,
  Users,
  Wifi,
  ShoppingCart,
  Crown
} from "lucide-react";
import { type SidebarData } from "../types";

export const parentSidebarData: SidebarData = {
  user: {
    name: "Tài khoản",
    email: "Đang tải...",
    avatar: "",
  },
  navGroups: [
    {
      title: "Chung",
      items: [
        { title: "Tổng quan", url: "/parent/dashboard", icon: LayoutDashboard },
        { title: "Hồ sơ trẻ", url: "/parent/children", icon: Baby },
        { title: "Thiết bị", url: "/parent/devices", icon: Wifi },
      ],
    },
    {
      title: "Dịch vụ & Hỗ trợ",
      items: [
        { title: "Gói dịch vụ", url: "/parent/subscription", icon: Crown },
        { title: "Phản hồi", url: "/parent/feedback", icon: MessageSquareText },
      ]
    }
  ],
};

export const adminSidebarData: SidebarData = {
  user: {
    name: "Admin",
    email: "admin@onbi.vn",
    avatar: "",
  },
  navGroups: [
    {
      title: "Chung",
      items: [
        { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
        { title: "Users", url: "/admin/users", icon: Users },
        { title: "Devices", url: "/admin/devices", icon: Wifi },
      ],
    },
    {
      title: "Orders & Subscription",
      items: [
        { title: "Pre-orders", url: "/admin/pre-orders", icon: ShoppingCart },
        { title: "Gói dịch vụ", url: "/admin/subscription-orders", icon: Crown },
      ]
    },
    {
      title: "Others",
      items: [
        { title: "Feedback", url: "/admin/feedback", icon: MessageSquareText },
        { title: "Activity", url: "/admin/activity", icon: Activity },
      ]
    }
  ],
};
