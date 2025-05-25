"use client";

import { Button } from "@/components/ui/button";
import { FaYahoo } from "react-icons/fa6";
import { GmailIcon } from "@/components/icons/GmailIcon";
import { OutlookIcon } from "@/components/icons/OutlookIcon";

interface EmailLinkProps {
  email?: string | null; // Make email optional and allow null
}

export default function EmailLink({ email }: EmailLinkProps) {
  // If no email is provided, show all three links
  if (!email) {
    return (
      <div className="flex items-center justify-center gap-2">
        {/* Gmail Button */}
        <Button variant="outline" asChild>
          <a href="https://mail.google.com/" target="_blank">
            <GmailIcon />
            Open Gmail
          </a>
        </Button>
        {/* Outlook Button */}
        <Button variant="outline" asChild>
          <a href="https://outlook.office.com/" target="_blank">
            <OutlookIcon />
            Open Outlook
          </a>
        </Button>
        {/* Yahoo Button */}
        <Button variant="outline" asChild>
          <a href="https://mail.yahoo.com/" target="_blank">
            <FaYahoo className="mr-2 h-4 w-4 text-[#4b0082]" />
            Open Yahoo
          </a>
        </Button>
      </div>
    );
  }

  // If email is provided, check for specific domains
  const domain = email.split("@")[1];

  if (domain === "gmail.com") {
    return (
      <Button variant="outline" asChild>
        <a href="https://mail.google.com/" target="_blank">
          <GmailIcon />
          Open Gmail
        </a>
      </Button>
    );
  } else if (
    domain === "outlook.com" ||
    domain === "hotmail.com" ||
    domain === "live.com"
  ) {
    return (
      <Button variant="outline" asChild>
        <a href="https://outlook.office.com/" target="_blank">
          <OutlookIcon />
          Open Outlook
        </a>
      </Button>
    );
  } else if (domain === "yahoo.com") {
    return (
      <Button variant="outline" asChild>
        <a href="https://mail.yahoo.com/" target="_blank">
          <FaYahoo className="mr-2 h-4 w-4 text-[#4b0082]" />
          Open Yahoo
        </a>
      </Button>
    );
  }

  return null; // Return nothing if the domain doesn't match
}
