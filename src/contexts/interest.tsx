import React, { Dispatch, SetStateAction, createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface InterestData {
  email: string;
  name: string;
  signed: boolean;
  setName(name: string): void;
  setEmail(email: string): void;
}

const InterestContext = createContext<InterestData>({} as InterestData);

export const InterestProvider: React.FC<Props> = ({ children }) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  return (
    <InterestContext.Provider
      value={{
        email,
        name,
        signed: !!email,
        setName,
        setEmail,
      }}
    >
      {children}
    </InterestContext.Provider>
  );
};

export default InterestContext;
