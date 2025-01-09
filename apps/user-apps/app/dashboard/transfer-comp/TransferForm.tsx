"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { useTheme } from "next-themes";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  bank: z.string().min(1, "Bank is required"),
  accountHolderName: z
    .string()
    .min(2, "Account holder name must be at least 2 characters"),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(20, "Account number must not exceed 20 digits"),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
});

const banks = [
  { value: "axis", label: "Axis Bank" },
  { value: "bob", label: "Bank of Baroda" },
  { value: "boi", label: "Bank of India" },
  { value: "union", label: "Union Bank" },
  { value: "sbi", label: "State Bank of India" },
];

type FormValues = z.infer<typeof formSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const MotionButton = motion(Button);
const MotionAlertDialogContent = motion(AlertDialogContent);
const MotionAlertDialogDescription = motion(AlertDialogDescription);
const MotionAlertDialogAction = motion(AlertDialogAction);

export default function TransferForm() {
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("deposit");
  const { theme } = useTheme();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      bank: "",
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success/failure (80% success rate)
      const success = Math.random() < 0.1;
      setIsSuccess(success);
      setIsAlertOpen(true);
    } catch (error) {
      setIsSuccess(false);
      setIsAlertOpen(true);
    }
  }

  const renderForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input placeholder="Enter amount" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the amount you want to {activeTab}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.value} value={bank.value}>
                        {bank.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the bank you want to {activeTab} {activeTab === "deposit" ? "from" : "to"}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="accountHolderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account holder name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter account number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name="ifscCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter IFSC code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MotionButton
            type="submit"
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {activeTab === "deposit" ? "Deposit" : "Withdraw"}
          </MotionButton>
        </motion.div>
      </form>
    </Form>
  );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[700px] px-3"
      >
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Transfer Money</CardTitle>
            <CardDescription>
              Add or withdraw money from your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit">Deposit</TabsTrigger>
                <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              </TabsList>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <TabsContent value="deposit">
                  {renderForm()}
                </TabsContent>
                <TabsContent value="withdraw">
                  {renderForm()}
                </TabsContent>
              </motion.div>
            </Tabs>
          </CardContent>
        </Card>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <MotionAlertDialogContent
            className="fixed ml-[-250px] mt-[-100px] z-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <CheckCircle2
                      className={
                        theme === "dark"
                          ? "h-6 w-6 text-green-500"
                          : "h-6 w-6 text-green-600"
                      }
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    <AlertCircle
                      className={
                        theme === "dark"
                          ? "h-6 w-6 text-red-500"
                          : "h-6 w-6 text-red-600"
                      }
                    />
                  </motion.div>
                )}
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {isSuccess ? "Transaction Successful" : "Transaction Failed"}
                </motion.span>
              </AlertDialogTitle>
              <MotionAlertDialogDescription
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isSuccess
                  ? `Your ${activeTab} transaction has been processed successfully.`
                  : `There was an error processing your ${activeTab} transaction. Please try again later.`}
              </MotionAlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <MotionAlertDialogAction
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAlertOpen(false)}
              >
                Close
              </MotionAlertDialogAction>
            </AlertDialogFooter>
          </MotionAlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
}