"use client";

import { useAuth } from "@/components/authProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation'
import { useState } from "react";

const LOGIN_URL = "/api/login/";

export function LoginForm({ className, ...props }) {
  const router = useRouter()
  const auth = useAuth();
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const objectFormForm = Object.fromEntries(formData);
    const jsonData = JSON.stringify(objectFormForm);

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Logged In");
        auth.login();
        router.push('/dashboard')
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Your Username"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your Password"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center -mt-2">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
