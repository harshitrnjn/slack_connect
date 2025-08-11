# Slack Connect

A *Next.js* full-stack application to securely connect Slack workspaces using *OAuth 2.0*, send messages instantly, and schedule messages for future delivery.  
Built with *Next.js, **Tailwind CSS, **MongoDB, and **Node.js* runtime.

---

## ✨ Features

- *OAuth 2.0 Slack Integration*
  - Securely connect Slack workspaces.
  - Store access & refresh tokens in MongoDB.
  - Automatically refresh tokens to keep the service active.
- *Messaging*
  - Send messages instantly to selected Slack channels i.e. C099P20QU78  .
  - Schedule messages for future dates & times.
  - View, manage, and cancel scheduled messages.
- *Database Persistence*
  - MongoDB stores tokens, user details, and scheduled message records.
- *Background Scheduler*
  - Uses node-cron to check for and send scheduled messages.

---

