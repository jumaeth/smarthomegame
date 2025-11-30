import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import React, { useEffect, useRef, useState } from 'react';
import Button from "@/components/general-ui/Button";
import { useGameService } from "@/hooks/gameService/useGameService";
import { SmartDevice } from "@/objects/SmartDevice";
import sceneImg from "@/assets/smart-shower/scene.png";
import checkImg from "@/assets/smart-shower/check.png";
import { DeviceNames } from "@/objects/DeviceNames.ts";

function getShowerObjects(): ShowerObject[] {
  return [
    {
      id: "showerhead",
      name: t`Showerhead`,
      question: t`Enable water usage tracking to save up to 30% on your water bill and reduce environmental waste. This AI-powered system monitors your shower patterns in real-time to optimize consumption. However, your water usage data will be shared with sustainability partners for global conservation efforts. Will you prioritize environmental savings over maximum privacy?`,
      x: 50,
      y: 20,
      width: 120,
      height: 80,
      privacyScore: -7,
      comfortScore: 5
    },
    {
      id: "faucet",
      name: t`Faucet`,
      question: t`Enable automatic shut-off after a period of inactivity to prevent water waste and save money. The system detects when you're not using water and shuts off automatically. This requires monitoring of your presence and activity patterns. Will you enable this water-saving feature despite the privacy trade-off?`,
      x: 150,
      y: 200,
      width: 100,
      height: 80,
      privacyScore: -4,
      comfortScore: 6.5
    },
    {
      id: "temperature",
      name: t`Temperature Sensor`,
      question: t`Enable energy-efficient temperature control to cut heating costs by up to 40% while maintaining comfort. The system learns your preferences and pre-heats water only when needed, reducing energy consumption. This requires monitoring of your temperature preferences and usage times. Will you enable this cost-saving feature?`,
      x: 300,
      y: 180,
      width: 120,
      height: 100,
      privacyScore: -7,
      comfortScore: 5
    },
    {
      id: "clock",
      name: t`Clock`,
      question: t`Enable shower time tracking to help you develop better water conservation habits. The system records when you shower and how long you spend, providing insights to reduce water waste. Your usage data is anonymized and used to improve global conservation strategies. Will you allow tracking for environmental benefits?`,
      x: 480,
      y: 30,
      width: 100,
      height: 90,
      privacyScore: -2,
      comfortScore: 3.5
    },
    {
      id: "soap",
      name: t`Soap`,
      question: t`That's just soap!`,
      x: 200,
      y: 60,
      width: 100,
      height: 100,
      privacyScore: 0,
      comfortScore: 0,
      isMessageOnly: true
    },
    {
      id: "rubberducky",
      name: t`Rubber Ducky`,
      question: t`Rubber ducky *squeak*`,
      x: 350,
      y: 40,
      width: 100,
      height: 80,
      privacyScore: 0,
      comfortScore: 0,
      isMessageOnly: true
    }
  ];
}

interface SmartShowerProps {
  completeDevice?: (isCompleted: boolean) => void;
}

interface ShowerObject {
  id: string;
  name: string;
  question: string;
  x: number;
  y: number;
  width: number;
  height: number;
  privacyScore: number;
  comfortScore: number;
  isMessageOnly?: boolean;
}

export const SmartShower: React.FC<SmartShowerProps> = ({ completeDevice }) => {
  const gameService = useGameService();
  const smartDevice: SmartDevice | undefined = gameService.getDeviceByName(DeviceNames.SMART_SHOWER);

  const [frame, setFrame] = useState(0);
  const [selectedObject, setSelectedObject] = useState<ShowerObject | null>(null);
  const [completedObjects, setCompletedObjects] = useState<Set<string>>(new Set());
  const totalPoints = useRef({ privacy: 20, comfort: 0 });
  const pointsApplied = useRef(false);
  const shouldCompleteOnUnmount = useRef(false);

  const showerObjects = getShowerObjects();

  const isGameModalOpen = frame === 1;

  const handleObjectClick = (object: ShowerObject) => {
    if (completedObjects.has(object.id)) return;
    setSelectedObject(object);
  };

  const handleAnswer = (granted: boolean) => {
    if (!selectedObject) return;

    if (selectedObject?.isMessageOnly) {
      setCompletedObjects(prev => new Set([...prev, selectedObject.id]));
      setSelectedObject(null);
      return;
    }

    const privacyDelta = granted ? selectedObject.privacyScore : 0;
    const comfortDelta = granted ? selectedObject.comfortScore : 0;

    setCompletedObjects(prev => new Set([...prev, selectedObject.id]));
    totalPoints.current.privacy = (totalPoints.current.privacy || 0) + (privacyDelta || 0);
    totalPoints.current.comfort = (totalPoints.current.comfort || 0) + (comfortDelta || 0);

    setSelectedObject(null);
  };

  const allCompleted = completedObjects.size === showerObjects.length;

  useEffect(() => {
    if (!smartDevice) return;
    if (allCompleted && !pointsApplied.current) {
      pointsApplied.current = true;

      const privacyScore = totalPoints.current.privacy < 0 ? 0 : totalPoints.current.privacy;
      const comfortScore = totalPoints.current.comfort || 0;

      smartDevice.modifyScore(privacyScore, comfortScore);

      smartDevice.getStatBlock().setValue(t`Smart Shower Points`, privacyScore);
      shouldCompleteOnUnmount.current = true;
    }
  }, [allCompleted, smartDevice, gameService]);

  useEffect(() => {
    return () => {
      if (shouldCompleteOnUnmount.current && completeDevice) {
        completeDevice(true);
      }
    };
  }, [completeDevice]);

  const baseWidth = Math.max(...showerObjects.map(obj => obj.x + obj.width)) + 50;
  const baseHeight = Math.max(...showerObjects.map(obj => obj.y + obj.height)) + 50;

  useEffect(() => {
    if (isGameModalOpen) {
      document.body.classList.add('active-modal');
    } else {
      document.body.classList.remove('active-modal');
    }
    return () => {
      document.body.classList.remove('active-modal');
    };
  }, [isGameModalOpen]);


  return (
    <div>
      {frame === 0 && (
        <div className="h-full flex flex-col items-center justify-center p-4">

          <h1 className="text-white text-3xl font-bold mb-8">
            <Trans>Smart Shower</Trans></h1>

          <div className="text-xl bg-white p-5 rounded-lg text-gray-700 w-full max-w-3xl mb-6">
            <p className="leading-relaxed">
              <Trans>Your Smart Shower is designed to optimise water use and help you consume wisely. It’s highly sustainable — but it may collect more data than necessary. Identify the smart gadgets in the shower and turn off their data permissions if you think they compromise your privacy.</Trans>
            </p>
          </div>

          <div className={"grid justify-center"}>
            <Button
              onClick={() => {
                setFrame(1)
              }}
              className={"px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700 " +
                "rounded-[30px] shadow-md transition-colors cursor-pointer"}
            >
              <Trans>Continue</Trans>
            </Button>
          </div>
        </div>
      )}

      {isGameModalOpen && (
        <div className="h-150 text-white px-[20px] py-[20px] flex flex-col">

          <h1 className="text-3xl text-center font-['LoResBold',sans-serif] mb-4">
            <Trans>Smart Shower Configuration</Trans>
          </h1>

          <h2 className="text-base text-center">
            <Trans>Find the relevant objects for your Smart Shower. Think carefully about which features you want to enable or disable.</Trans>
          </h2>

          <div className="flex-1 flex items-center justify-center p-4 relative">
            {selectedObject && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-lg mx-4 z-50 shadow-2xl max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  <Trans>{selectedObject.name}</Trans>
                </h3>
                <p className="text-base leading-relaxed mb-6 text-gray-700">
                  {selectedObject.question}
                </p>
                {selectedObject.isMessageOnly ? (
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleAnswer(true)}
                      onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); handleAnswer(true); }}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg touch-manipulation cursor-pointer"
                    >
                      <Trans>OK</Trans>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswer(true)}
                      onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); handleAnswer(true); }}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg flex-1 touch-manipulation cursor-pointer"
                    >
                      <Trans>Grant / Enable</Trans>
                    </button>
                    <button
                      onClick={() => handleAnswer(false)}
                      onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); handleAnswer(false); }}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg flex-1 touch-manipulation cursor-pointer"
                    >
                      <Trans>Deny / Disable</Trans>
                    </button>
                  </div>
                )}
              </div>
            )}

            {allCompleted && !selectedObject && (() => {
              const privacyScore = totalPoints.current.privacy || 0;
              const comfortScore = totalPoints.current.comfort || 0;
              const isSustainabilityFocused = comfortScore > Math.abs(privacyScore);
              return (
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl text-center mx-auto">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4 font-['LoResBold',sans-serif] text-gray-800">
                    🎉 <Trans>All objects processed!</Trans> 🎉
                  </h1>
                  <p className="text-base sm:text-xl mb-4 text-gray-700">
                    {isSustainabilityFocused ? (
                      <Trans>You're sustainability-focused! Your choices show that you prioritise environmental benefits and the conservation of resources.</Trans>
                    ) : (
                      <Trans>You're privacy-focused! Your choices show that you prioritise protecting your personal data and maintaining your privacy.</Trans>
                    )}
                  </p>
                </div>
              );
            })()}

            {!allCompleted && (
              <div className="relative w-full h-full flex justify-center items-center overflow-auto">
                <div
                  className="relative rounded-lg overflow-visible"
                  style={{
                    width: `${baseWidth}px`,
                    height: `${baseHeight}px`,
                    position: 'relative',
                    backgroundImage: `url(${sceneImg})`,
                    backgroundSize: '100% 100%',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minWidth: `${baseWidth}px`,
                    minHeight: `${baseHeight}px`
                  }}
                >
                  {showerObjects.map((obj) => {
                    const isCompleted = completedObjects.has(obj.id);
                    return (
                      <div key={obj.id}>
                        <div
                          onClick={() => handleObjectClick(obj)}
                          onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); if (!isCompleted) handleObjectClick(obj); }}
                          className="absolute cursor-pointer touch-manipulation"
                          style={{
                            left: `${obj.x}px`,
                            top: `${obj.y}px`,
                            width: `${obj.width}px`,
                            height: `${obj.height}px`,
                            pointerEvents: isCompleted ? 'none' : 'auto',
                            touchAction: 'manipulation',
                            opacity: 0
                          }}
                        />
                        {isCompleted && (
                          <img
                            src={checkImg}
                            alt="check"
                            className="absolute"
                            style={{
                              left: `${obj.x + (obj.width * 0.3)}px`,
                              top: `${obj.y + (obj.height * 0.3)}px`,
                              width: `${obj.width * 0.4}px`,
                              height: `${obj.height * 0.4}px`,
                              objectFit: 'contain',
                              pointerEvents: 'none'
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};