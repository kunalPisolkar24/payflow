"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Send } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { UserAvatar } from "@repo/ui/components/user-avatar";
import { SendMoneyDialog } from "./send-money-dialog";
import { useTheme } from "next-themes";

interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
}

export default function SendMoney() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSend = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <Card
      className={`w-[900px] ${
        theme === "dark" ? "text-zinc-50" : "text-zinc-900"
      }`}
    >
      <CardHeader>
        <CardTitle
          className={`text-2xl font-semibold ${
            theme === "dark" ? "text-zinc-50" : "text-zinc-900"
          }`}
        >
          Send Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search
            className={`absolute left-3 top-1/2 transform -translate-y-1/2  ${
              theme === "dark" ? "text-zinc-400" : "text-zinc-500"
            }`}
          />
          <Input
            type="text"
            placeholder="Search users..."
            className={`pl-10 ${
              theme === "dark" ? "text-zinc-50" : "text-zinc-900"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AnimatePresence>
          {filteredUsers.length > 0 && (
            <motion.ul
              className="mt-4 space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredUsers.map((user) => (
                <motion.li
                  key={user.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      theme === "dark" ? "bg-zinc-900" : "bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <UserAvatar name={user.name} image={user.image} />
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-zinc-50" : "text-zinc-900"
                        }`}
                      >
                        {user.name}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleSend(user)}
                      className={`${
                        theme === "dark"
                          ? "bg-zinc-50 text-zinc-950 hover:bg-zinc-200/90"
                          : "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90"
                      }`}
                    >
                      <Send
                        className={`h-4 w-4 mr-2 ${
                          theme === "dark" ? "text-zinc-950" : "text-zinc-50"
                        }`}
                      />
                      Send
                    </Button>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        {searchTerm && filteredUsers.length === 0 && (
          <p
            className={`text-center mt-4 ${
              theme === "dark" ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            {filteredUsers.length === 0
              ? "Type to find users"
              : "No users found"}
          </p>
        )}
      </CardContent>
      {selectedUser && (
        <SendMoneyDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          user={selectedUser}
        />
      )}
    </Card>
  );
}