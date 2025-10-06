"use client";

import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

// Data structure for sidebar items
interface SidebarItem {
	id: string;
	label: string;
	href?: string;
	icon: any; // LucideIcon type
	children?: SidebarItem[];
}

interface SidebarItemComponentProps {
	item: SidebarItem;
	isOpen: boolean;
	onToggle: (itemId: string) => void;
	onLinkClick: () => void;
}

export function SidebarItemComponent({
	item,
	isOpen,
	onToggle,
	onLinkClick,
}: SidebarItemComponentProps) {
	const hasChildren = item.children && item.children.length > 0;

	if (hasChildren) {
		return (
			<Collapsible open={isOpen} onOpenChange={() => onToggle(item.id)}>
				<SidebarMenu>
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton>
								<item.icon className="h-4 w-4" />
								<span>{item.label}</span>
								{isOpen ? (
									<ChevronDownIcon className="ml-auto h-4 w-4" />
								) : (
									<ChevronRightIcon className="ml-auto h-4 w-4" />
								)}
							</SidebarMenuButton>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{item.children?.map((child) => (
									<SidebarMenuSubItem key={child.id}>
										<SidebarMenuSubButton asChild>
											<Link
												href={child.href || "#"}
												onClick={onLinkClick}
											>
												{child.icon && <child.icon className="size-4" />}
												{child.label}
											</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					</SidebarMenuItem>
				</SidebarMenu>
			</Collapsible>
		);
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton asChild>
					<Link href={item.href || "#"} onClick={onLinkClick}>
						<item.icon className="h-4 w-4" />
						<span>{item.label}</span>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
