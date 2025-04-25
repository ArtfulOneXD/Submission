"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  PlusSquare,
  LayoutDashboard,
  LogOut,
  Settings2,
  ListChecks,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

// SidebarItem component (JS version)
export function SidebarItem({ label, href, icon: Icon }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  );
}

// Sidebar main structure
export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="px-4 py-2 text-sm font-semibold">CrowdX</div>
      </SidebarHeader>

      <SidebarContent className="space-y-2">
        <SidebarItem label="All Campaigns" href="/dashboard" icon={ListChecks} />
        <SidebarItem label="My Campaigns" href="/dashboard/my-campaigns" icon={User} />
        <SidebarItem label="Create Campaign" href="/create" icon={PlusSquare} />
        <SidebarItem
          label="Blockchain Campaigns"
          href="/dashboard/blockchain-campaigns"
          icon={LayoutDashboard}
        />
        <SidebarItem label="Edit Account" href="/dashboard/account" icon={Settings2} />
        <SidebarItem label="Logout" href="/logout" icon={LogOut} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: "CrowdX User",
            email: "you@example.com",
          }}
        />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
