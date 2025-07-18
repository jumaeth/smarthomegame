import {useEffect, useRef, useState} from "react";

interface IconProgressProps {
  iconPath: string;
  progress: number; // 1 to 100
}

export default function ProgressBar({iconPath, progress}: IconProgressProps) {
  const [displayedProgress, setDisplayedProgress] = useState(progress);
  const [delta, setDelta] = useState(0);
  const [showDelta, setShowDelta] = useState(false);
  const [barColor, setBarColor] = useState("bg-yellow-500");
  const prevProgressRef = useRef(progress);

  useEffect(() => {
    const clamped = Math.min(Math.max(progress, 1), 100);
    const deltaVal = clamped - prevProgressRef.current;

    if (deltaVal !== 0) {
      setDelta(deltaVal);
      setShowDelta(true);
      setBarColor(deltaVal > 0 ? "bg-green-500" : "bg-red-500");

      const showDuration = 3000;
      const updateDelay = 300;
      const resetDelay = 3000;

      setTimeout(() => {
        setShowDelta(false);
      }, showDuration);

      setTimeout(() => {
        setDisplayedProgress(clamped);
      }, showDuration + updateDelay);

      setTimeout(() => {
        setBarColor("bg-yellow-500");
      }, showDuration + updateDelay + resetDelay);
    }

    prevProgressRef.current = clamped;
  }, [progress]);

  return (
          <div className="m-4 flex items-center space-x-2 relative">
            <div className="relative w-12 h-12 flex-shrink-0 mr-10">
              {showDelta && (
                      <div className={`absolute left-1/2 -translate-x-1/2 text-sm font-bold animate-coinDelta ${delta > 0 ? "text-yellow-400" : "text-red-500"}`}>
                        <div className="flex items-center space-x-1">
                          <img src={iconPath} alt="icon" className="w-6 h-6"/>
                          <p>{delta > 0 ? `+${delta}` : delta}</p>
                        </div>
                      </div>
              )}
            </div>

            <img src={iconPath} alt="icon" className="w-12 h-12 flex-shrink-0"/>
            <div className="w-48 h-4 bg-gray-700 rounded overflow-hidden relative">
              <div className={`h-full ${barColor} absolute top-0 transition-all duration-2000`}
                   style={{width: `${displayedProgress}%`}}/>
            </div>

            <style>
              {`
              @keyframes coinDelta {
                0% {
                  opacity: 0;
                  transform: translate(0, +32px);
                }
                30% {
                  opacity: 1;
                  transform: translate(0, 0px);
                }
                60% {
                  opacity: 1;
                  transform: translate(0, 0px);
                }
                100% {
                  opacity: 0;
                  transform: translate(0, 0px);
                }
              }
          
              .animate-coinDelta {
                animation: coinDelta 3s ease-out forwards;
              }
  `}
            </style>
          </div>
  );
}
