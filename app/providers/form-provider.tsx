"use client";

import { createContext, useState } from "react";

export const formContext = createContext<{
  currentTitle: string;
  setCurrentTitle: (title: string) => void;
}>({
  currentTitle: "",
  setCurrentTitle: () => {},
});

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTitle, setCurrentTitle] = useState("");
  return (
    <formContext.Provider value={{ currentTitle, setCurrentTitle }}>
      {children}
    </formContext.Provider>
  );
};
