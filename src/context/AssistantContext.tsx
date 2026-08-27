import { createContext, useContext, useState, type ReactNode } from "react";

interface AssistantContextValue {
  isOpen: boolean;
  ouvrirAssistant: () => void;
  fermerAssistant: () => void;
  toggleAssistant: () => void;
}

const AssistantContext = createContext<AssistantContextValue | undefined>(
  undefined,
);

export const AssistantProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        ouvrirAssistant: () => setIsOpen(true),
        fermerAssistant: () => setIsOpen(false),
        toggleAssistant: () => setIsOpen((v) => !v),
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const ctx = useContext(AssistantContext);
  if (!ctx)
    throw new Error("useAssistant doit être utilisé dans un AssistantProvider");
  return ctx;
};
