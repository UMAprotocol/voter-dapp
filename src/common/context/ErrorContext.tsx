import { useState, useCallback, createContext, FC, ReactNode } from "react";

interface ContextProps {
  error: string | undefined;
  addError: (message: string) => void;
  removeError: () => void;
}

export const ErrorContext = createContext<ContextProps>({
  error: undefined,
  addError: () => {},
  removeError: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

const ErrorProvider: FC<ProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const removeError = () => setError(undefined);

  const addError = (message: string | undefined) => setError(message);

  const contextValue: ContextProps = {
    error,
    addError: useCallback((message) => addError(message), []),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
