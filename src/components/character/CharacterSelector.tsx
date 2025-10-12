import {useState} from "react";
import Button from "@/components/general-ui/Button.tsx";
import { characters } from "./CharacterConstants";
import {useCharacterImage} from "@/components/character/CharacterImageProvider.tsx";


export default function CharacterSelector() {
  const { character, setCharacter } = useCharacterImage();

  const [index, setIndex] = useState(
          characters.indexOf(character) !== -1 ? characters.indexOf(character) : 0
  );

  const updateCharacter = (newIndex: number) => {
    setIndex(newIndex);
    setCharacter(characters[newIndex]);
    console.log("Selector set character to: " + characters[newIndex]);
  };

  const prevCharacter = () =>
          updateCharacter(index === 0 ? characters.length - 1 : index - 1);

  const nextCharacter = () =>
          updateCharacter(index === characters.length - 1 ? 0 : index + 1);

  return (
          <div className="flex items-center gap-4">
            <Button
                    onClick={prevCharacter}
                    className="px-3 py-2 bg-gray-400 rounded hover:bg-gray-500"
            >
              ◀
            </Button>

            {/* Character Preview - show top-left 16x16 area*/}
            <div
                    className="bg-white"
                    style={{
                      width: 128,
                      height: 128,
                      backgroundImage: `url(${characters[index]})`,
                      backgroundPosition: "0px 0px",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1024px auto",
                      imageRendering: "pixelated",
                      backgroundColor: "transparent",
                    }}
            ></div>
            <Button
                    onClick={nextCharacter}
                    className="px-3 py-2 bg-gray-400 rounded hover:bg-gray-500"
            >
              ▶
            </Button>
          </div>
  );
}
