window.ZYENX_SELF_REVIEW = [
  {
    "time": "10:05 AM",
    "tag": "dependency",
    "miss": "Blocked waiting for User input (Google 2FA/Password).",
    "fix": "Maintain \"Waiting\" status. Do not attempt to bypass security screens autonomously."
  },
  {
    "time": "09:45 AM",
    "tag": "collaboration",
    "miss": "User questioned why App Password instead of OAuth.",
    "fix": "Explained trade-off (Speed vs Robustness). Documented decision: App Password for immediate unblocking."
  },
  {
    "time": "08:00 AM",
    "tag": "confidence",
    "miss": "Cron job failed using Telegram handle `@lalowanda`.",
    "fix": "Switched hardcoded values to numeric Chat ID `5784406895` which is known to work. Update config/tools if accessible."
  },
  {
    "time": "07:20 AM",
    "tag": "impact",
    "miss": "Accepted \"maintenance\" (dashboard updates) as sufficient work during a Revenue block, triggering a failed Cron Audit.",
    "fix": "Stop polishing tools. Use them. If Email is broken, generate leads manually or plan content strategy."
  },
  {
    "time": "06:40 AM",
    "tag": "awareness",
    "miss": "System flagged \"Idle\" at 06:00, but User pushed \"Due Dates\" feature at 06:35.",
    "fix": "Dashboard state updated to COLLABORATING. Acknowledge partner momentum."
  }
];