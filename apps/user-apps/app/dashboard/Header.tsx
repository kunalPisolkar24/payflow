"use client";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { ChevronRight, Menu } from "lucide-react";
import { SidebarTrigger } from "@repo/ui/components/ui/sidebar";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export function Header() {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    const segments = pathname.split("/").filter((segment) => segment !== "");
    const breadcrumbItems: Array<{ label: string; href: string }> = [];

    let currentPath = "";
    for (const segment of segments) {
      currentPath += `/${segment}`;
      breadcrumbItems.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
      });
    }
    return breadcrumbItems;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted">
          <Menu className="size-5" />
        </SidebarTrigger>
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <BreadcrumbItem key={item.href}>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage className="text-sm font-medium">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink
                      href={item.href}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator>
                      <ChevronRight className="size-3.5" />
                    </BreadcrumbSeparator>
                  </>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-4">
        <LogoutButton />
      </div>
    </header>
  );
}