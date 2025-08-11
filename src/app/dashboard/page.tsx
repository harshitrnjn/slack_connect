// src/app/dashboard/page.tsx
"use client";

import { Suspense } from "react";
import Dashboard from "../component/DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading dashboard...</div>}>
      <Dashboard/>
    </Suspense>
  );
}
