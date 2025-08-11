// src/app/dashboard/page.tsx
"use client";

import { Suspense } from "react";
import SlackSuccessContent from "../component/SlackSuccessContent";

export default function SlackSuccessPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      <SlackSuccessContent/>
    </Suspense>
  );
}
