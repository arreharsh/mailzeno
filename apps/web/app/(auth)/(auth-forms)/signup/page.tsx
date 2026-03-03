import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Sign Up for Free",
  description:
    "Create your free MailZeno account. Send up to 100 transactional emails per day using your own SMTP provider. Developer-first API, Node.js SDK, and real-time logs.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupClient />;
}
