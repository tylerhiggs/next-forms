"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import type { BuiltInProviderType } from "next-auth/providers/index";
import { Button } from "@/components/ui/button";
import GoogleButton from "@/components/GoogleButton";
import Image from "next/image";

type Providers = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;

export default function SignIn() {
  const [providers, setProviders] = useState<Providers>(null);

  useEffect(() => {
    const setAuthProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setAuthProviders();
  }, []);

  if (!providers) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Sign in to Next Forms
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Choose your preferred sign-in method
          </p>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          {Object.values(providers).map((provider) =>
            provider.name === "Google" ? (
              <GoogleButton
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              />
            ) : (
              <Button
                variant="outline"
                className="w-full rounded-full flex space-between"
                key={provider.name}
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                {provider.name === "GitHub" && (
                  <Image
                    src="../github-mark.svg"
                    alt="GitHub"
                    className="inline h-5 w-5 align-middle dark:invert"
                    height={20}
                    width={20}
                  />
                )}
                <div className="flex-grow text-center">
                  Sign in with {provider.name}
                </div>
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
