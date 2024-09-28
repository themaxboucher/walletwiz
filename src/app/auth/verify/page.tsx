import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { BiLogoGmail } from "react-icons/bi";
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { FaYahoo } from "react-icons/fa6";

export default function VerifyPage() {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="p-4 rounded-full border border-border bg-background">
        <MailCheck className="text-primary size-6" />
      </div>
      <h1 className="heading-2">Please verify your email</h1>
      <p>
        Click on the temporary login link we sent to your email. <br /> If you
        did not receive it right away, please check your spam folder.
      </p>
      <div className="mt-2 flex items-center justify-center gap-2">
        <Button variant="outline" asChild>
          <a href="https://mail.google.com/" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="mr-2 h-4 w-4"
            >
              <path
                fill="#4caf50"
                d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
              ></path>
              <path
                fill="#1e88e5"
                d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
              ></path>
              <polygon
                fill="#e53935"
                points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
              ></polygon>
              <path
                fill="#c62828"
                d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
              ></path>
              <path
                fill="#fbc02d"
                d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
              ></path>
            </svg>
            Open Gmail
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href="https://outlook.office.com/" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="48"
              height="48"
              viewBox="0 0 48 48"
              className="mr-2 h-4 w-4"
            >
              <path
                fill="#1a237e"
                d="M43.607,23.752l-7.162-4.172v11.594H44v-6.738C44,24.155,43.85,23.894,43.607,23.752z"
              ></path>
              <path
                fill="#0c4999"
                d="M33.919,8.84h9.046V7.732C42.965,6.775,42.19,6,41.234,6H17.667c-0.956,0-1.732,0.775-1.732,1.732 V8.84h9.005H33.919z"
              ></path>
              <path
                fill="#0f73d9"
                d="M33.919,33.522h7.314c0.956,0,1.732-0.775,1.732-1.732v-6.827h-9.046V33.522z"
              ></path>
              <path
                fill="#0f439d"
                d="M15.936,24.964v6.827c0,0.956,0.775,1.732,1.732,1.732h7.273v-8.558H15.936z"
              ></path>
              <path
                fill="#2ecdfd"
                d="M33.919 8.84H42.964999999999996V16.866999999999997H33.919z"
              ></path>
              <path
                fill="#1c5fb0"
                d="M15.936 8.84H24.941000000000003V16.866999999999997H15.936z"
              ></path>
              <path
                fill="#1467c7"
                d="M24.94 24.964H33.919V33.522H24.94z"
              ></path>
              <path
                fill="#1690d5"
                d="M24.94 8.84H33.919V16.866999999999997H24.94z"
              ></path>
              <path
                fill="#1bb4ff"
                d="M33.919 16.867H42.964999999999996V24.963H33.919z"
              ></path>
              <path
                fill="#074daf"
                d="M15.936 16.867H24.941000000000003V24.963H15.936z"
              ></path>
              <path
                fill="#2076d4"
                d="M24.94 16.867H33.919V24.963H24.94z"
              ></path>
              <path
                fill="#2ed0ff"
                d="M15.441,42c0.463,0,26.87,0,26.87,0C43.244,42,44,41.244,44,40.311V24.438 c0,0-0.03,0.658-1.751,1.617c-1.3,0.724-27.505,15.511-27.505,15.511S14.978,42,15.441,42z"
              ></path>
              <path
                fill="#139fe2"
                d="M42.279,41.997c-0.161,0-26.59,0.003-26.59,0.003C14.756,42,14,41.244,14,40.311V25.067 l29.363,16.562C43.118,41.825,42.807,41.997,42.279,41.997z"
              ></path>
              <path
                fill="#00488d"
                d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"
              ></path>
              <path
                fill="#fff"
                d="M13.914,18.734c-3.131,0-5.017,2.392-5.017,5.343c0,2.951,1.879,5.342,5.017,5.342 c3.139,0,5.017-2.392,5.017-5.342C18.931,21.126,17.045,18.734,13.914,18.734z M13.914,27.616c-1.776,0-2.838-1.584-2.838-3.539 s1.067-3.539,2.838-3.539c1.771,0,2.839,1.585,2.839,3.539S15.689,27.616,13.914,27.616z"
              ></path>
            </svg>
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
    </div>
  );
}
