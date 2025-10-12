import {getCookie, setCookie} from "@/utils/cookies.ts";
import React, {createContext, useContext, useState} from "react";
import {characters, COOKIE_KEY} from "@/components/character/CharacterConstants.ts";

const getInitialCharacter = (): string => {
  const saved = getCookie(COOKIE_KEY);
  return saved && characters.includes(saved) ? saved : characters[0];
};

interface CharacterContextType {
  character: string;
  setCharacter: (value: string) => void;
}

const CharacterContext = createContext<CharacterContextType>({
  character: getInitialCharacter(),
  setCharacter: () => {},
});

export const CharacterImageProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                                  children,
                                                                                }) => {
  const [character, setCharacterState] = useState<string>(getInitialCharacter());

  const setCharacter = (value: string) => {
    setCharacterState(value);
    setCookie(COOKIE_KEY, value);
    console.log("Provider set to: " + value)
  };

  return (
          <CharacterContext.Provider value={{character, setCharacter}}>
            {children}
          </CharacterContext.Provider>
  );
};

export const useCharacterImage = () => useContext(CharacterContext);