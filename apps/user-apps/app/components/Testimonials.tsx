import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/ui/avatar";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  initials: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  theme: string | undefined;
}

const testimonials: Testimonial[] = [
  {
    quote: "PayFlow has revolutionized how we handle international payments. The speed and security are unmatched in the industry.",
    author: "John Doe",
    role: "CEO & Founder",
    avatar: "/api/placeholder/40/40",
    initials: "JD"
  },
  {
    quote: "The integration was seamless, and the customer support team has been exceptional. We've seen a 50% reduction in payment processing time.",
    author: "Jane Doe",
    role: "CTO",
    avatar: "/api/placeholder/40/40",
    initials: "JD"
  },
  {
    quote: "As a global business, we needed a reliable payment solution. PayFlow delivered beyond our expectations with their innovative platform.",
    author: "John Smith",
    role: "COO",
    avatar: "/api/placeholder/40/40",
    initials: "JS"
  },
  {
    quote: "PayFlow's analytics dashboard gives us invaluable insights into our payment trends. It's a game-changer for financial planning.",
    author: "Sarah Lee",
    role: "Financial Analyst",
    avatar: "/api/placeholder/40/40",
    initials: "SL"
  },
  {
    quote: "We were impressed by how easily PayFlow integrated with our existing CRM. It's streamlined our entire payment workflow.",
    author: "Mark Johnson",
    role: "Head of Operations",
    avatar: "/api/placeholder/40/40",
    initials: "MJ"
  },
  {
    quote: "With PayFlow, we've expanded our business into new markets with confidence. Their multi-currency support is exceptional.",
    author: "Emily Chen",
    role: "VP of International Expansion",
    avatar: "/api/placeholder/40/40",
    initials: "EC"
  }
];

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, theme }) => (
  <Card className="h-full border p-6 md:p-8">
    <blockquote className="text-lg md:text-xl text-muted-foreground mb-6">
      "{testimonial.quote}"
    </blockquote>
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
        <AvatarFallback className={theme === "dark" ? "bg-zinc-800 text-zinc-200" : ""}>
          {testimonial.initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold">{testimonial.author}</div>
        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
      </div>
    </div>
  </Card>
);

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const { resolvedTheme } = useTheme();

  const getVisibleCount = (): number => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3; // lg
      if (window.innerWidth >= 768) return 2;  // md
      return 1; // sm
    }
    return 3; // default to lg for SSR
  };

  const getVisibleTestimonials = (): Testimonial[] => {
    const count = getVisibleCount();
    const visible: Testimonial[] = [];
    
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % testimonials.length;
      // Since we know testimonials is a non-empty array and we're using modulo,
      // this access will always be safe, but we'll use the non-null assertion
      // operator to satisfy TypeScript
      visible.push(testimonials[index]!);
    }
    
    return visible;
  };

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Since getVisibleTestimonials now explicitly returns Testimonial[],
  // this assignment is type-safe
  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div className="w-full py-12 px-4 md:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Why Clients Love Us
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousTestimonial}
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

        <div className="relative h-[400px] overflow-hidden">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ 
                x: direction > 0 ? 1000 : -1000,
                opacity: 0
              }}
              animate={{ 
                x: 0,
                opacity: 1
              }}
              exit={{ 
                x: direction < 0 ? 1000 : -1000,
                opacity: 0
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="flex gap-4 absolute w-full"
            >
              {visibleTestimonials.map((testimonial, i) => (
                <div
                  key={`${currentIndex}-${i}`}
                  className="w-full lg:w-1/3 md:w-1/2 flex-shrink-0"
                >
                  <TestimonialCard 
                    testimonial={testimonial}
                    theme={resolvedTheme}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}