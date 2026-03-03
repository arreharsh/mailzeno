import type { Metadata } from "next";
import LoginClient from "./loginClient";

export const metadata: Metadata = {
  title: "Log In",
  description:
    "Log in to your MailZeno account to manage SMTP configurations, send transactional emails, view delivery logs, and access your email API dashboard.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}