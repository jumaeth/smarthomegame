import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import React, {useState, useEffect, useRef} from 'react';
import Button from "@/components/general-ui/Button.tsx";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";

interface SmartShowerProps {
  completeDevice: () => void;
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
}

export const SmartShower: React.FC<SmartShowerProps> = ({completeDevice}) => {
  const gameService = useGameService();
  const smartDevice: SmartDevice | undefined = gameService.getDeviceByName("SmartShower");
  
  // Use a state to control the view: 0 = Intro, 1 = Game Modal
  const [frame, setFrame] = useState(0);
  const [selectedObject, setSelectedObject] = useState<ShowerObject | null>(null);
  const [completedObjects, setCompletedObjects] = useState<Set<string>>(new Set());
  const totalPoints = useRef({ privacy: 0, comfort: 0 });
  const pointsApplied = useRef(false);

  useEffect(() => {
    if (smartDevice) {
      smartDevice.getStatBlock().startTimer();
    }
  }, [smartDevice]);

  const handleGameComplete = () => {
    completeDevice();
  };
  const isGameModalOpen = frame === 1;

  const showerObjects: ShowerObject[] = [
    {
      id: "showerhead",
      name: t`Shower Head`,
      question: t`Enable water usage tracking to optimize consumption and reduce waste?`,
      x: 50,
      y: 20,
      width: 120,
      height: 80,
      privacyScore: -3,
      comfortScore: 3
    },
    {
      id: "faucet",
      name: t`Faucet`,
      question: t`Enable automatic shut-off after inactivity to save water?`,
      x: 200,
      y: 60,
      width: 100,
      height: 100,
      privacyScore: -2,
      comfortScore: 4
    },
    {
      id: "temperature",
      name: t`Temperature Sensor`,
      question: t`Enable energy-efficient temperature control to reduce heating costs?`,
      x: 350,
      y: 40,
      width: 100,
      height: 80,
      privacyScore: -3,
      comfortScore: 3
    },
    {
      id: "lighting",
      name: t`Shower Lighting`,
      question: t`Enable automatic LED lighting that turns off when not in use to save energy?`,
      x: 480,
      y: 30,
      width: 100,
      height: 90,
      privacyScore: -1,
      comfortScore: 2
    },
    {
      id: "speaker",
      name: t`Shower Speaker`,
      question: t`Enable low-power mode that reduces energy consumption but limits features?`,
      x: 150,
      y: 200,
      width: 100,
      height: 80,
      privacyScore: 2,
      comfortScore: -2
    },
    {
      id: "mirror",
      name: t`Shower Mirror`,
      question: t`Enable smart defogging that uses minimal energy and only when needed?`,
      x: 300,
      y: 180,
      width: 120,
      height: 100,
      privacyScore: -1,
      comfortScore: 2
    }
  ];

  const handleObjectClick = (object: ShowerObject) => {
    if (completedObjects.has(object.id)) return;
    setSelectedObject(object);
  };

  const handleAnswer = (granted: boolean) => {
    if (!selectedObject) return;

    // When granting: use the object's scores directly
    // When denying: reverse the scores (privacy gain, sustainability loss)
    const privacyDelta = granted ? selectedObject.privacyScore : -selectedObject.privacyScore;
    const comfortDelta = granted ? selectedObject.comfortScore : -selectedObject.comfortScore;

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

      const privacyScore = totalPoints.current.privacy || 0;
      const comfortScore = totalPoints.current.comfort || 0;

      if (privacyScore) {
        gameService.changeScore(privacyScore, 'privacy');
      }
      if (comfortScore) {
        gameService.changeScore(comfortScore, 'comfort');
      }

      smartDevice.getStatBlock().setValue("Smart Shower Points", privacyScore);
      smartDevice.getStatBlock().stopTimer();
      gameService.completeDevice("SmartShower");
      // Don't call handleGameComplete here - let user confirm first
    }
  }, [allCompleted, smartDevice, gameService]);

  // Calculate container size based on object positions
  const containerWidth = Math.max(...showerObjects.map(obj => obj.x + obj.width)) + 50; // Add 50px padding
  const containerHeight = Math.max(...showerObjects.map(obj => obj.y + obj.height)) + 50; // Add 50px padding

  React.useEffect(() => {
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

                      {/* White Rectangular Info Box */}
                      <div className="text-xl bg-white p-5 rounded-lg text-gray-700 w-full max-w-3xl mb-6">
                        <p className="leading-relaxed">
                          <Trans>Configure your smart shower by clicking on objects and deciding which permissions to grant or services to enable.</Trans>
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

            {/* Game Modal (Frame 1) */}
            {isGameModalOpen && (
                    <div className="h-150 text-white h-full px-[30px] py-[12px] flex flex-col">

                      <h1 className="text-3xl text-center font-['LoResBold',sans-serif]">
                        <Trans>Smart Shower Configuration</Trans>
                      </h1>

                      <div className="p-[14px] px-[28px] mb-4 relative">
                        {/* Question modal */}
                        {selectedObject && (
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md mx-4 z-50 shadow-lg">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">
                              <Trans>{selectedObject.name}</Trans>
                            </h3>
                            <p className="text-lg mb-6 text-gray-700">
                              {selectedObject.question}
                            </p>
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
                          </div>
                        )}

                        {/* Completion message */}
                        {allCompleted && !selectedObject && (
                          <div className="bg-white rounded-xl p-6 w-full max-w-2xl text-center mx-auto">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4 font-['LoResBold',sans-serif] text-gray-800">
                              <Trans>🎉 All Objects Processed! 🎉</Trans>
                            </h1>
                            <p className="text-base sm:text-xl mb-4 text-gray-700">
                              <Trans>You have completed configuring all shower objects.</Trans>
                            </p>
                            <button
                              onClick={handleGameComplete}
                              onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); handleGameComplete(); }}
                              className="px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-[30px] shadow-md transition-colors cursor-pointer touch-manipulation"
                            >
                              <Trans>Continue</Trans>
                            </button>
                          </div>
                        )}

                        {/* Shower picture (solid color block) with clickable objects */}
                        {!allCompleted && (
                          <div className="relative w-full flex justify-center">
                            <div 
                              className="relative rounded-lg overflow-hidden"
                              style={{ 
                                backgroundColor: '#667eea',
                                width: `${containerWidth}px`,
                                height: `${containerHeight}px`,
                                position: 'relative'
                              }}
                            >
                              {showerObjects.map((obj) => {
                                const isCompleted = completedObjects.has(obj.id);
                                return (
                                  <div
                                    key={obj.id}
                                    onClick={() => handleObjectClick(obj)}
                                    onTouchEnd={(e: React.TouchEvent) => { e.preventDefault(); if (!isCompleted) handleObjectClick(obj); }}
                                    className={`absolute border-2 rounded-lg cursor-pointer transition-all touch-manipulation ${
                                      isCompleted 
                                        ? 'border-green-500 bg-green-500/20' 
                                        : 'border-yellow-400 bg-yellow-400/30 hover:bg-yellow-400/50 active:bg-yellow-400/70'
                                    }`}
                                    style={{
                                      left: `${obj.x}px`,
                                      top: `${obj.y}px`,
                                      width: `${obj.width}px`,
                                      height: `${obj.height}px`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexDirection: 'column',
                                      pointerEvents: isCompleted ? 'none' : 'auto',
                                      touchAction: 'manipulation'
                                    }}
                                  >
                                    <div className="text-white text-sm font-bold text-center px-2">
                                      <Trans>{obj.name}</Trans>
                                    </div>
                                    {isCompleted && (
                                      <div className="text-green-500 text-2xl font-bold">✓</div>
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
