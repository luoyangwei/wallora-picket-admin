"use client"

import * as React from "react"
import { IconAperture, IconPhotoSquareRounded, IconSettings, IconUsers, IconVersions } from '@tabler/icons-react'



import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: IconPhotoSquareRounded,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: IconPhotoSquareRounded,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: IconPhotoSquareRounded,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Features",
            url: "#",
            icon: IconAperture,
            isActive: true,
            items: [
                {
                    title: "Photos",
                    url: "/photos",
                },
                {
                    title: "Collections",
                    url: "/collections",
                },
                {
                    title: "Favorites",
                    url: "/favorites",
                },
            ],
        },
        {
            title: "Versioning",
            url: "#",
            icon: IconVersions,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                // {
                //     title: "Explorer",
                //     url: "#",
                // },
                // {
                //     title: "Quantum",
                //     url: "#",
                // },
            ],
        },
        {
            title: "Users",
            url: "#",
            icon: IconUsers,
            items: [
                {
                    title: "Devices",
                    url: "#",
                },
                {
                    title: "Subscribed",
                    url: "#",
                },
                {
                    title: "Free Trial",
                    url: "#",
                }
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        // {
        //     name: "Design Engineering",
        //     url: "#",
        //     icon: IconPhotoSquareRounded,
        // },
        // {
        //     name: "Sales & Marketing",
        //     url: "#",
        //     icon: IconPhotoSquareRounded,
        // },
        // {
        //     name: "Travel",
        //     url: "#",
        //     icon: IconPhotoSquareRounded,
        // },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
