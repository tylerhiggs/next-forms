"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Next Forms
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div>Loading...</div>
            ) : session ? (
              <>
                <span className="text-muted-foreground">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <Button href="/dashboard" variant="ghost">
                  Dashboard
                </Button>
                <Button variant="destructive" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="default" onClick={() => signIn()}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
