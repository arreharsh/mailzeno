import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing – Free & Pro Plans",
  description:
    "Choose the right MailZeno plan for your email needs. Free plan with 100 emails/day or Pro plan with 2,000 emails/day, priority support, and 30-day log retention. No hidden fees, cancel anytime.",
  keywords: [
    "email API pricing",
    "SMTP API pricing",
    "free email API",
    "transactional email pricing",
    "email service pricing",
    "affordable email API",
    "Resend pricing alternative",
    "SendGrid pricing alternative",
  ],
  alternates: {
    canonical: "https://mailzeno.dev/pricing",
  },
  openGraph: {
    title: "MailZeno Pricing – Free & Pro Plans for Developers",
    description:
      "Start free with 100 emails/day. Upgrade to Pro for 2,000 emails/day and priority support. Open-source email API.",
    url: "https://mailzeno.dev/pricing",
  },
};

export default function PricingPage() {
  return <PricingClient />;
}