import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  type NavCollapsible,
  type NavItem,
  type NavLink,
  type NavGroup as NavGroupProps,
} from "./types";

export function NavGroup({ title, items }: NavGroupProps) {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const key = `${item.title}-${item.url || "group"}`;

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={pathname} />;

          if (state === "collapsed" && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} href={pathname} />
            );

          return <SidebarMenuCollapsible key={key} item={item} href={pathname} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const checkIsActive = (href: string, item: NavItem, mainNav = false) => {
  if (!item.url) return false;
  return (
    href === item.url || // Exact match
    href.split("?")[0] === item.url || // Match without query params
    (!mainNav && !!item.url && href.startsWith(item.url)) // Prefix match
  );
};

function SidebarMenuLink({ item, href }: { item: NavLink; href: string }) {
  const { setOpenMobile } = useSidebar();
  const isActive = checkIsActive(href, item);
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={item.url} onClick={() => setOpenMobile(false)} />}
        isActive={isActive}
        tooltip={item.title}
        className="font-medium"
      >
        {item.icon && <item.icon className="size-4" />}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SidebarMenuCollapsible({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) {
  const { setOpenMobile } = useSidebar();
  const isDefaultOpen = checkIsActive(href, item, true);
  
  return (
    <Collapsible
      defaultOpen={isDefaultOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={<SidebarMenuButton tooltip={item.title} className="font-medium" />}
        >
          {item.icon && <item.icon className="size-4" />}
          <span>{item.title}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  render={<Link href={subItem.url} onClick={() => setOpenMobile(false)} />}
                  isActive={checkIsActive(href, subItem)}
                  className="font-medium"
                >
                  {subItem.icon && <subItem.icon className="size-4" />}
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
}: {
  item: NavCollapsible;
  href: string;
}) {
  const isActive = checkIsActive(href, item);
  
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className="font-medium"
            />
          }
        >
          {item.icon && <item.icon className="size-4" />}
          <span>{item.title}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {item.title} {item.badge ? `(${item.badge})` : ""}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          {item.items.map((subItem) => (
            <DropdownMenuItem key={subItem.title} render={<Link href={subItem.url} />} className="font-medium">
              {subItem.icon && <subItem.icon className="mr-2 size-4" />}
              <span className="max-w-52 text-wrap">{subItem.title}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
