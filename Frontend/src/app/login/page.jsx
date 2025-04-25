import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/loginForm";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:to-black p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-8 p-8 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl border border-blue-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2 self-center font-semibold text-muted-foreground hover:text-primary transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          CrowdX Inc.
        </Link>

        <LoginForm />

        <div className="text-center text-sm text-muted-foreground">
          Don’t have an account?
          <Link
            href="/signup"
            className="ml-1 font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

