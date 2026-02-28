# Send Reminders Edge Function

Sends email reminders 24h and 1h before appointments.

## Setup

1. Create a [Resend](https://resend.com) account and get an API key.
2. Add the secret: `supabase secrets set RESEND_API_KEY=your_key`
3. Deploy: `supabase functions deploy send-reminders`
4. Schedule via cron (e.g. every hour): Add to your hosting platform or use Supabase cron.

## Manual trigger

```bash
curl -X POST https://your-project.supabase.co/functions/v1/send-reminders \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```
