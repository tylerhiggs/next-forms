"use client";

import { createContext, useState } from "react";

export const formContext = createContext<{
  currentTitle: string | null;
  setCurrentTitle: (title: string) => void;
  currentPrivacy: boolean | null;
  setCurrentPrivacy: (isPrivate: boolean) => void;
}>({
  currentTitle: null,
  setCurrentTitle: () => {},
  currentPrivacy: null,
  setCurrentPrivacy: () => {},
});

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [currentPrivacy, setCurrentPrivacy] = useState<boolean | null>(null);
  return (
    <formContext.Provider
      value={{
        currentTitle,
        setCurrentTitle,
        currentPrivacy,
        setCurrentPrivacy,
      }}
    >
      {children}
    </formContext.Provider>
  );
};
