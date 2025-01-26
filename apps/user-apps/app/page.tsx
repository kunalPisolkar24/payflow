"use client";
import { useState, useEffect } from 'react';
import BusinessSection from "./components/BusinessSection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import TestimonialCarousel from "./components/Testimonials";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import { Loader } from "@repo/ui/components/loader"; // Import the Loader component

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data or resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <>
          <Navbar />
          <Hero />
          <BusinessSection />
          <TestimonialCarousel />
          <FAQSection />
          <Footer />
        </>
      )}
    </>
  );
}