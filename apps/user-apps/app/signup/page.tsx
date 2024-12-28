// // apps/user-app/signup/page.tsx

// "use client";

// import { useState, useEffect, FormEvent } from "react";
// import SignUpForm from "@repo/ui/components/Signup";
// import { Loader } from "@repo/ui/components/loader"; // Import the Loader

// export default function SignUpPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPageLoading, setIsPageLoading] = useState(true); 
//   useEffect(() => {
//     // Simulate loading the SignUpForm component
//     const timer = setTimeout(() => {
//       setIsPageLoading(false);
//     }, 1000); // Adjust the delay as needed

//     return () => clearTimeout(timer);
//   }, []);

//   async function onSubmit(event: FormEvent) {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       // Your actual API call here, e.g.:
//       // await fetch('/api/signup', { method: 'POST', body: /* ... */ });
//     } catch (error) {
//       console.error("Signup failed:", error);
//       // Handle signup error (e.g., show an error message)
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div>
//       {isPageLoading ? (
//         <div className="flex justify-center items-center h-screen">
//           <Loader />
//         </div>
//       ) : (
//         <SignUpForm isLoading={isLoading} onSubmit={onSubmit} />
//       )}
//     </div>
//   );
// }

// apps/user-app/signup/page.tsx

"use client";

import { useState, useEffect } from "react";
import SignUpForm from "@repo/ui/components/Signup";
import { Loader } from "@repo/ui/components/loader";

export default function SignUpPage() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000); // Simulate loading the SignUpForm

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isPageLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      ) : (
        <SignUpForm isLoading={false} />
      )}
    </div>
  );
}