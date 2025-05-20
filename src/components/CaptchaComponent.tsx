import {useEffect, useState} from "react";
import {Trans} from "@lingui/react/macro";
import {loadImagesFromFolder} from "./loadImages";

type CaptchaProps = {
  pictureFolder: string;
  solutions: boolean[];
  onComplete: (isCompleted: boolean) => void;
};

export const CaptchaComponent = ({pictureFolder, solutions, onComplete}: CaptchaProps) => {
  const images = loadImagesFromFolder(pictureFolder);
  const imageList = Object.values(images);

  const [displayedIndices, setDisplayedIndices] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Initialize the grid with first 9 images
  useEffect(() => {
    setDisplayedIndices(Array.from({length: 9}, (_, i) => i));
  }, []);

  const handleImageClick = (gridIndex: number) => {
    if (isCompleted) return;
    const imageIndex = displayedIndices[gridIndex];
    if (imageIndex < solutions.length) {
      setScore(prevScore => prevScore + (solutions[imageIndex] ? 1 : -1));
    }

    // Replace clicked image with next available image
    setDisplayedIndices(prev => {
      const updated = [...prev];
      const nextImageIndex = Math.max(...prev) + 1;
      updated[gridIndex] = nextImageIndex < imageList.length ? nextImageIndex : -1;
      return updated;
    });
  };

  const submitAnswer = () => {
    setIsCompleted(true);
    onComplete(score > 0);
  };

  return (
          <div className="flex flex-col items-center gap-6">
            <div className="grid grid-cols-3 gap-4">
              {displayedIndices.map((imageIndex, gridIndex) => (
                      <div key={gridIndex} className={`w-30 h-30 flex items-center justify-center rounded-lg overflow-hidden
              ${imageIndex >= 0 && !isCompleted ? "cursor-pointer hover:opacity-80 border-2 border-gray-300" : "bg-gray-100"}
              transition-all duration-200
            `}
                           onClick={() => imageIndex >= 0 && !isCompleted && handleImageClick(gridIndex)}
                      >{imageIndex >= 0 && imageIndex < imageList.length ? (
                              <img
                                      src={imageList[imageIndex]}
                                      alt={`question-${imageIndex}`}
                                      className="w-full h-full object-cover"
                              />) : (<div className="w-full h-full bg-gray-200"></div>)}
                      </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              {isCompleted && (
                      <div className={`text-lg font-bold ${score > 0 ? "text-green-600" : "text-red-600"}`}>
                        {score > 0 ? <Trans>Success!</Trans> : <Trans>Failed!</Trans>}
                      </div>
              )}

              <button
                      onClick={submitAnswer}
                      disabled={isCompleted}
                      className={`
            px-4 py-2 rounded-md font-medium
            ${isCompleted ? "bg-gray-300 text-gray-600" : "bg-blue-600 text-black hover:bg-blue-700"}
            transition-colors duration-200
          `}
              >
                <Trans>Antwort abschicken</Trans>
              </button>

              {!isCompleted && (
                      <div className="text-sm text-gray-600 mt-1">
                        <Trans>Current score: {score}</Trans>
                      </div>
              )}
            </div>
          </div>
  );
};