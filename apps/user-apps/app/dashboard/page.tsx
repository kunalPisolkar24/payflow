import {
  SidebarProvider,
  SidebarInset,
} from "@repo/ui/components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { PropsWithChildren } from "react";
import { Header } from "./Header";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex w-full flex-col">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}