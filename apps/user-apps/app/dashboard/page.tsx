// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../api/auth/[...nextauth]/route";
// import { redirect } from "next/navigation";
// import LogoutButton from "./LogoutButton"; // Import the Client Component

// export default async function Dashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/");
//   }

//   return (
//     <div>
//       <nav className="flex justify-end p-4">
//         <LogoutButton /> {/* Use the Client Component here */}
//       </nav>
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-lg text-muted-foreground mt-2">
//             Welcome, {session.user?.name}!
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/dashboard/layout.tsx
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