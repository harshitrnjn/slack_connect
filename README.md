# Slack Connect

A _Next.js_ full-stack application to securely connect Slack workspaces using _OAuth 2.0_, send messages instantly, and schedule messages for future delivery.  
Built with _Next.js, **Tailwind CSS, **MongoDB, and \*\*Node.js_ runtime.

---

- _Frontend Dashboard – A responsive UI (React + Tailwind CSS + React Toastify) where users can_

  - Connect their Slack account via OAuth.
  - Send instant messages to Slack channels.
  - Schedule messages with date and time.
  - View scheduled messages (pending/sent) in a sidebar with live updates.
  - Delete scheduled messages before they are sent.

- _Backend APIs – Next.js API routes handle:_

  - Send messages instantly to selected Slack channels i.e. C099P20QU78 (This channel is set to default so that testing easier, can change the code by creating a fork and pushing to a seperate branch) .
  - Schedule messages for future dates & times.

  - Manage, and cancel scheduled messages.

  - Slack authentication and token storage.

  - Sending instant messages via Slack API.

  - Storing scheduled messages in MongoDB.

  - Retrieving scheduled messages for a user.

  - Deleting scheduled messages from the database.

  - Processing and sending scheduled messages at the right time.

- _Database Persistence_

  - MongoDB stores tokens, user details, and scheduled message records.

- _Scheduling System – A serverless-friendly scheduler triggered via an external cron service (e.g., cron-job.org) that:_

  - Periodically checks the database for pending messages whose send time has arrived.

  - Sends them to Slack.

  - Updates their status to “sent”.

---

_Conclusion_

- The result is a full-stack Slack messaging tool that works seamlessly on Vercel without background workers, gives real-time status tracking, and allows both instant and scheduled message delivery in Slack channels.

#HOW TO SETUP CODE:#

- Clone the Repository
  bash

  git clone https://github.com/harshitrnjn/slack_connect.git
  cd slack_connect

-  Install Dependencies
  bash
 
  npm install

- Create a .env.local File
    Inside your project root, create a .env.local file:

    env

    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
    SLACK_CLIENT_ID=your_slack_client_id
    SLACK_CLIENT_SECRET=your_slack_client_secret
    SLACK_REDIRECT_URI=https://<your-ngrok-url>/api/auth/slack
    FRONTEND_URL=http://localhost:3000
    SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxxxxxxxxxxxxx
    NGROK_URL=https://<your-ngrok-url>

---
