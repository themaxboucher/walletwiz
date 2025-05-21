import { Button } from "@/components/ui/button";
import { FaYahoo } from "react-icons/fa6";
import { GmailIcon } from "@/components/icons/GmailIcon";
import { OutlookIcon } from "@/components/icons/OutlookIcon";

export default function EmailLinks() {
  return (
    <div className="mt-2 flex items-center justify-center gap-2">
      <Button variant="outline" asChild>
        <a href="https://mail.google.com/" target="_blank">
          <GmailIcon />
          Open Gmail
        </a>
      </Button>
      <Button variant="outline" asChild>
        <a href="https://outlook.office.com/" target="_blank">
          <OutlookIcon />
          Open Outlook
        </a>
      </Button>
      <Button variant="outline" asChild>
        <a href="https://mail.yahoo.com/" target="_blank">
          <FaYahoo className="mr-2 h-4 w-4 text-[#4b0082]" />
          Open Yahoo
        </a>
      </Button>
    </div>
  );
}
