"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import type { ClientSafeProvider, LiteralUnion } from "next-auth/react";
import type { BuiltInProviderType } from "next-auth/providers/index";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Next Forms
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your preferred sign-in method
          </p>
        </div>
        <div className="space-y-4">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with {provider.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
