// src/app/success/page.tsx
"use client";

import { Suspense } from "react";
import SlackSuccessContent from "../component/SlackSuccessContent";

export default function SlackSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Loading...</p></div>}>
      <SlackSuccessContent />
    </Suspense>
  );
}
