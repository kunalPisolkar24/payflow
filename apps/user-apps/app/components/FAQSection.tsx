"use client"

import { motion } from "framer-motion"
import { Badge } from "@repo/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card"
import { useTheme } from "next-themes" 

const faqs = [
  {
    id: 1,
    question: "What is PayFlow and how does it work?",
    answer: "PayFlow is a secure digital payment platform that enables fast, seamless transactions across borders. It uses advanced blockchain technology to process payments instantly while maintaining the highest security standards."
  },
  {
    id: 2,
    question: "What are the fees for using PayFlow?",
    answer: "Our fee structure is transparent and competitive. We charge a small percentage per transaction with no hidden costs. Volume discounts are available for business accounts processing large numbers of transactions."
  },
  {
    id: 3,
    question: "How secure is PayFlow?",
    answer: "PayFlow employs bank-level encryption and multi-factor authentication to ensure your transactions are secure. We're compliant with international security standards and regularly undergo security audits."
  },
  {
    id: 4,
    question: "Which countries do you support?",
    answer: "PayFlow is available in over 100 countries worldwide. We support major currencies and provide real-time exchange rates for international transactions. Check our coverage map for specific country availability."
  },
  {
    id: 5,
    question: "How long do transfers take?",
    answer: "Most transactions are processed instantly. International transfers typically complete within 1-2 business days, depending on the destination country and banking systems involved."
  },
  {
    id: 6,
    question: "What kind of customer support do you offer?",
    answer: "We provide 24/7 customer support through live chat, email, and phone. Our dedicated support team is available to help with any questions or issues you may encounter."
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function FAQSection() {
  const { resolvedTheme } = useTheme();

  return (
    <section className="py-24 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge 
            className="mb-4" 
            variant={resolvedTheme === "dark" ? "secondary" : "outline"} 
          >
            FAQ
          </Badge>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
          >
            Common Questions & Answers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Find out all the essential details about our platform and how it can serve your needs.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-1 lg:grid-cols-2"
        >
          {faqs.map((faq) => (
            <motion.div key={faq.id} variants={itemVariants}>
              <Card className="h-full dark:bg-zinc-900 dark:text-zinc-100 border-zinc-800"> {/* Manually set border color */}
                <CardHeader>
                  <CardTitle className="flex gap-4 text-lg">
                    <span className="text-muted-foreground font-mono">
                      {String(faq.id).padStart(2, '0')}
                    </span>
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  {faq.answer}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}