import "./Modal.css";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {useState} from "react";
import {SmartDevice} from "@/objects/SmartDevice.ts";

type onCompletionCallback = (isCompleted: boolean) => void;

interface SmartTvOption {
  id: string;
  label: string;
  checked: boolean;
  warning?: string;
  privacyScore: number;
  comfortScore: number;
}

export const SmartTv = ({onCompletion}: { onCompletion: onCompletionCallback }) => {
  const gameService = useGameService();
  const smartTvDevice: SmartDevice = gameService.getDeviceByName("SmartTv");
  smartTvDevice.getStatBlock().startTimer();
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
    smartTvDevice.getStatBlock().stopTimer();
    console.log("Smart TV settings calculated!");
    console.log(`Privacy Score: ${totalPrivacyScore}, Comfort Score: ${totalComfortScore}`);
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
    onCompletion(true);
  };

  const closeWarning = () => {
    setShowWarning(null);
  };

  if (showDialogue) {
    return (
            <div className="flex flex-col items-center justify-center p-4">

              <h1 className="text-white text-2xl font-bold mb-8">
                <Trans>Smart TV Setup</Trans></h1>
              <div className="modal-info-box">
                <p className="leading-relaxed">
                  <Trans>Your Smart TV was reset to its default settings. Uncheck
                    settings if you think you do not need them for your Smart TV to be working smart, and leave the
                    permissions if they are needed for your TV experience. Choose wisely - your decisions impact your
                    privacy status!</Trans></p>
              </div>
              <button onClick={() => setShowDialogue(false)}
                      className="btn-modal-primary"
              >
                <Trans>Continue</Trans>
              </button>
            </div>
    );
  }

  return (

          <div className="modal-window">
            <h1><Trans>Smart TV Settings</Trans></h1>

            <div className="modal-content">
              <p><Trans>Select which features you want to enable for your Smart TV:</Trans></p>

            <div className="settings-list-container">
              {options.map((option: SmartTvOption) => (
                      <div key={option.id} className="settings-list-item">
                        <label className="settings-list-label">
                          <input
                                  type="checkbox"
                                  checked={option.checked}
                                  onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                                  className="settings-checkbox"
                          />
                          <span>{option.label}</span>
                        </label>
                      </div>
              ))}
            </div>

            <button
                    onClick={handleSubmit}
                    className="btn-modal-primary"
            >
              <Trans>Send answer</Trans>
            </button>
          </div>

            {showWarning && (
                    <div className="feedback-success">
                      <h4><Trans>⚠️ Warning</Trans></h4>
                      <p style={{marginBottom: '15px', color: '#333'}}>{showWarning}</p>
                      <button
                              onClick={closeWarning}
                              style={{
                                padding: '8px 16px'
                              }}
                      >
                        <Trans>Continue</Trans>
                      </button>
                    </div>
            )}

            {showReconfigureWarning && (
                    <div style={{
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'white',
                      padding: '24px',
                      border: '2px solid #dc3545',
                      borderRadius: '8px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                      zIndex: 1000,
                      maxWidth: '500px'
                    }}>
                      <h4 style={{
                        marginTop: 0,
                        color: '#dc3545',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '12px'
                      }}><Trans>⚠️ Privacy Warning</Trans></h4>
                      <p style={{marginBottom: '20px', color: '#333', lineHeight: '1.5', fontSize: '14px'}}>
                        <Trans>Your current settings result in a higher privacy loss than comfort gain. This may not
                          be
                          the optimal balance for your privacy.</Trans>
                      </p>
                      <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                        <button
                                onClick={handleReconfigure}
                                style={{
                                  padding: '10px 20px',
                                  backgroundColor: '#6c757d',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                        >
                          <Trans>Reconfigure</Trans>
                        </button>
                        <button
                                onClick={handleConfirmSettings}
                                style={{
                                  padding: '10px 20px',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                        >
                          <Trans>Continue Anyway</Trans>
                        </button>
                      </div>
                    </div>
            )}

            {showSuccessMessage && (
                    <div style={{
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'white',
                      padding: '24px',
                      border: '2px solid #28a745',
                      borderRadius: '8px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                      zIndex: 1000,
                      maxWidth: '400px'
                    }}>
                      <h4 style={{
                        marginTop: 0,
                        color: '#28a745',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '12px'
                      }}><Trans>✅ Device Configured</Trans></h4>
                      <p style={{marginBottom: '20px', color: '#333', lineHeight: '1.5', fontSize: '14px'}}>
                        {calculatedScores.privacy < 0 && Math.abs(calculatedScores.privacy) > calculatedScores.comfort
                                ? <Trans>Your Smart TV has been configured with your chosen settings.</Trans>
                                : <Trans>Your Smart TV has been configured with a good balance of privacy and
                                  comfort!</Trans>}
                      </p>
                      <button
                              onClick={handleSuccessMessageClose}
                              style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                      >
                        <Trans>Continue</Trans>
                      </button>
                    </div>
            )}
          </div>
  );
};
