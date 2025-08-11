import cron from "node-cron";
import { processScheduledMessages } from "@/utils/processScheduledMessages";

// Run every minute
export function startScheduler() {
  console.log("📅 Scheduler started, checking every minute...");
  
  cron.schedule("* * * * *", async () => {
    console.log("⏳ Checking scheduled messages...");
    await processScheduledMessages();
  });
}
