"use client";

import { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";

type HeaderProps = {
  activePage: string;
};

export function Header({ activePage }: HeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getBreadcrumbItems = () => {
    const breadcrumbItems: Array<{ label: string; href: string }> = [];
    breadcrumbItems.push({
      label: "Dashboard",
      href: "/dashboard",
    });

    let activeLabel = "";
    switch (activePage) {
      case "transfer":
        activeLabel = "Transfer";
        break;
      case "transaction":
        activeLabel = "Transaction";
        break;
      case "p2p":
        activeLabel = "P2P Transfer";
        break;
      default:
        activeLabel = "Transfer"; // Default label
    }

    breadcrumbItems.push({
      label: activeLabel,
      href: `/dashboard/${activePage}`, // Still create a URL, even if it's not used for routing
    });
    return breadcrumbItems;
  };

  if (!mounted) {
    return null;
  }

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
            <BreadcrumbItem>
              <BreadcrumbLink className="text-sm font-medium">
                Dashboard
              </BreadcrumbLink>
              <BreadcrumbSeparator>
                <ChevronRight className="size-3.5" />
              </BreadcrumbSeparator>
            </BreadcrumbItem>
            {breadcrumbItems.slice(1).map((item, index) => (
              <BreadcrumbItem key={item.href}>
                {/* No need for conditional rendering here since we always have at least 2 items */}
                <>
                  <BreadcrumbPage className="text-sm font-medium">
                    {item.label}
                  </BreadcrumbPage>
                  {index !== breadcrumbItems.length - 2 && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="size-3.5" />
                    </BreadcrumbSeparator>
                  )}
                </>
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}