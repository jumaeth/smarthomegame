import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {useState} from "react";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import React from "react";

interface SmartTvOption {
  id: string;
  label: string;
  checked: boolean;
  warning?: string;
  privacyScore: number;
  comfortScore: number;
}

interface SmartTvProps {
  onCompletion?: (isCompleted: boolean) => void;
}

export const SmartTv: React.FC<SmartTvProps> = ({ onCompletion }) => {
  const gameService = useGameService();
  const smartTvDevice: SmartDevice = gameService.getDeviceByName("SmartTv");
  const [showDialogue, setShowDialogue] = useState(true);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [showReconfigureWarning, setShowReconfigureWarning] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [calculatedScores, setCalculatedScores] = useState({privacy: 0, comfort: 0});

  const [options, setOptions] = useState<SmartTvOption[]>([
    {
      id: "faceId",
      label: t`Face ID activated`,
      checked: true,
      warning: t`If you opt out of Face ID, you'll need to use a PIN or password to verify purchases or access TV settings, which may be less convenient.`,
      privacyScore: -5,
      comfortScore: 1
    },
    {
      id: "googleAccount",
      label: t`Logged in with Google Account`,
      checked: true,
      warning: t`If you opt out of Google Account sync, you won't be able to access your personalized content, recommendations, and purchased apps.`,
      privacyScore: -1,
      comfortScore: 5
    },
    {
      id: "healthApp",
      label: t`Synced with Health App`,
      checked: true,
      warning: t`If you opt out of the Health App, Smart TV cannot track your screen time anymore and send Health Alerts.`,
      privacyScore: -5,
      comfortScore: 0
    },
    {
      id: "smartHomeHub",
      label: t`Synced with Smart Home Hub`,
      checked: true,
      warning: t`If you opt out of Smart Home Hub sync, your TV won't be able to control other smart devices or respond to home automation.`,
      privacyScore: -1,
      comfortScore: 5
    },
    {
      id: "smartHomeApp",
      label: t`Synced with Smart Home App`,
      checked: true,
      warning: t`If you opt out of Smart Home App sync, you won't be able to control your TV remotely or receive notifications.`,
      privacyScore: -1,
      comfortScore: 3
    },
    {
      id: "microphone",
      label: t`Microphone On`,
      checked: true,
      warning: t`If you opt out of microphone access, voice commands and voice search will not work.`,
      privacyScore: -3,
      comfortScore: 2
    },
    {
      id: "voiceRecognition",
      label: t`Voice recognition on`,
      checked: true,
      warning: t`If you opt out of voice recognition, the TV won't be able to learn your voice patterns for better accuracy.`,
      privacyScore: -10,
      comfortScore: 1
    },
    {
      id: "camera",
      label: t`Camera On`,
      checked: true,
      warning: t`If you opt out of camera access, gesture controls and video calling features will not work.`,
      privacyScore: -10,
      comfortScore: 1
    },
    {
      id: "locationServices",
      label: t`Location Services`,
      checked: true,
      warning: t`If you opt out of location services, local content and weather information may not be accurate.`,
      privacyScore: -5,
      comfortScore: 0
    },
    {
      id: "analytics",
      label: t`Usage Analytics`,
      checked: true,
      warning: t`If you opt out of usage analytics, the TV won't be able to provide personalized recommendations.`,
      privacyScore: -5,
      comfortScore: 2
    }
  ]);

  const handleOptionChange = (id: string, checked: boolean) => {
    const option = options.find((opt: SmartTvOption) => opt.id === id);
    if (!checked && option?.warning) {
      setShowWarning(option.warning);
    }

    setOptions((prev: SmartTvOption[]) => prev.map((opt: SmartTvOption) =>
            opt.id === id ? {...opt, checked} : opt
    ));
  };

  const handleSubmit = () => {
    // Calculate score based on individual option scores
    const totalPrivacyScore = options.reduce((total: number, opt: SmartTvOption) => {
      return total + (opt.checked ? opt.privacyScore : 0);
    }, 0);

    const totalComfortScore = options.reduce((total: number, opt: SmartTvOption) => {
      return total + (opt.checked ? opt.comfortScore : 0);
    }, 0);

    setCalculatedScores({privacy: totalPrivacyScore, comfort: totalComfortScore});

    // Check if privacy loss is higher than comfort gain
    const privacyLoss = Math.abs(totalPrivacyScore); // Convert negative to positive
    if (privacyLoss > totalComfortScore) {
      setShowReconfigureWarning(true);
    } else {
      // Privacy loss is lower than comfort gain, configure instantly
      gameService.changeScore(totalPrivacyScore, 'privacy');
      gameService.changeScore(totalComfortScore, 'comfort');
      setShowSuccessMessage(true);
    }
    smartTvDevice.getStatBlock().setValue("Smart TV Comfort Score", totalComfortScore);
    smartTvDevice.getStatBlock().setValue("Smart TV Privacy Score", totalPrivacyScore);
  };

  const handleReconfigure = () => {
    setShowReconfigureWarning(false);
    // User wants to reconfigure, stay on the same screen
  };

  const handleConfirmSettings = () => {
    setShowReconfigureWarning(false);
    // User confirms the settings despite privacy loss
    gameService.changeScore(calculatedScores.privacy, 'privacy');
    gameService.changeScore(calculatedScores.comfort, 'comfort');
    setShowSuccessMessage(true);
  };

  const handleSuccessMessageClose = () => {
    setShowSuccessMessage(false);
    onCompletion?.(true);
  };

  const closeWarning = () => {
    setShowWarning(null);
  };

  if (showDialogue) {
    return (
            <div className="flex flex-col items-center justify-center p-4">

              <h1 className="text-white text-3xl font-bold mb-8">
                <Trans>Smart TV Setup</Trans></h1>
              <div className="text-xl bg-white p-5 rounded-lg text-gray-700 w-full max-w-3xl mb-6">
                <p className="leading-relaxed">
                  <Trans>Your Smart TV was reset to its default settings. Uncheck
                    settings if you think you do not need them for your Smart TV to be working smart, and leave the
                    permissions if they are needed for your TV experience. Choose wisely - your decisions impact your
                    privacy status!</Trans></p>
              </div>
              <button onClick={() => setShowDialogue(false)}
                      className="px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700
                      rounded-[30px] shadow-md transition-colors cursor-pointer"
              >
                <Trans>Continue</Trans>
              </button>
            </div>
    );
  }

  return (

          <div className="text-2xl text-white px-[30px] py-[12px] w-[800px]">
            <h1 className="text-center text-3xl mb-4 font-['LoResBold',sans-serif] "><Trans>Smart TV Settings</Trans></h1>

            <div className="text-xl px-[5px]">
              <p><Trans>Select which features you want to enable for your Smart TV:</Trans></p>

            <div className="max-h-[400px] overflow-y-auto mb-5">
              {options.map((option: SmartTvOption) => (
                      <div key={option.id} className="mt-2.5 mb-3 p-3 border border-grey-400 rounded-md">
                        <label className="flex items-center cursor-pointer">
                          <input
                                  type="checkbox"
                                  checked={option.checked}
                                  onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                                  className="mr-5 scale-[1.8] accent-[#37a820]"
                          />
                          <span>{option.label}</span>
                        </label>
                      </div>
              ))}
            </div>

            <button
                    onClick={handleSubmit}
                    className="px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700
                              rounded-[30px] shadow-md transition-colors cursor-pointer text-white
                              mx-auto block w-full max-w-[30%] mb-2"
            >
              <Trans>Send answer</Trans>
            </button>
          </div>

            {showWarning && (
                    <div className="absolute text-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg
                    shadow-md text-center text-[#222222] bg-[#FEF3C7]">
                      <h3 className="text-2xl font-bold mb-2"><Trans>Warning ⚠️</Trans></h3>
                      <p className="mb-4">{showWarning}</p>
                      <button
                              onClick={closeWarning}
                              className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl transition-colors cursor-pointer w-full"
                      >
                        <Trans>Continue</Trans>
                      </button>
                    </div>
            )}

            {showReconfigureWarning && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg
                     shadow-md z-10 text-center text-[#222222] bg-[#FECACA]">
                      <h3 className="text-2xl font-bold mb-2"><Trans>❗️ Privacy Warning ❗️</Trans></h3>
                      <p className="mb-4 text-xl">
                        <Trans>Your current settings result in a higher privacy loss than comfort gain. This may not
                          be the optimal balance for your privacy.</Trans>
                      </p>
                      <div className="flex gap-2.5 justify-center">
                        <button
                                onClick={handleReconfigure}
                                className="px-8 py-[10px] text-white text-lg font-semibold bg-green-600 hover:bg-green-700
                      rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                          <Trans>Reconfigure</Trans>
                        </button>
                        <button
                                onClick={handleConfirmSettings}
                                className="px-3 py-[10px] text-white bg-red-600 text-lg font-semibold hover:bg-red-700
                      rounded-xl shadow-md transition-colors cursor-pointer"
                        >
                          <Trans>Continue anyway</Trans>
                        </button>
                      </div>
                    </div>
            )}

            {showSuccessMessage && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-lg
                    shadow-md z-10 text-center text-[#222222] bg-[#d1fae5]">
                      <h3 className="text-2xl font-bold mb-2"><Trans>Device Configured ✅ </Trans></h3>
                      <p className="mb-4 text-xl">
                        {calculatedScores.privacy < 0 && Math.abs(calculatedScores.privacy) > calculatedScores.comfort
                                ? <Trans>Your Smart TV has been configured with your chosen settings.</Trans>
                                : <Trans>Your Smart TV has been configured with a good balance of privacy and
                                  comfort!</Trans>}
                      </p>
                      <button
                              onClick={handleSuccessMessageClose}
                              className="px-6 py-2 text-white text-lg font-semibold bg-green-600 hover:bg-green-700
                      rounded-xl shadow-md transition-colors cursor-pointer w-full"
                      >
                        <Trans>Continue</Trans>
                      </button>
                    </div>
            )}
          </div>
  );
};