// SmartLights.tsx
import "./Modal.css";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useState } from "react";
import { useGameService } from "@/hooks/gameService/useGameService.tsx";

type onCompletionCallback = (isCompleted: boolean) => void;

interface SmartLightOption {
  id: string;
  label: string;
  checked: boolean;
  warning?: string;
  privacyScore: number;
  comfortScore: number;
}

export const SmartLights = ({ onCompletion }: { onCompletion: onCompletionCallback }) => {
  const gameService = useGameService();

  const [showDialogue, setShowDialogue] = useState(true);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [showReconfigureWarning, setShowReconfigureWarning] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [calculatedScores, setCalculatedScores] = useState({ privacy: 0, comfort: 0 });

  const [options, setOptions] = useState<SmartLightOption[]>([
    {
      id: "bluetooth",
      label: t`Bluetooth enabled`,
      checked: true,
      warning: t`If you disable Bluetooth, quick pairing (e.g., with light bridges or presence sensors) will no longer work.`,
      privacyScore: -3,
      comfortScore: 2,
    },
    {
      id: "wifi",
      label: t`Wi-Fi enabled`,
      checked: true,
      warning: t`If you disable Wi-Fi, the lights cannot be controlled remotely and lose cloud features.`,
      privacyScore: -2,
      comfortScore: 3,
    },
    {
      id: "energyLogging",
      label: t`Energy consumption logging`,
      checked: true,
      warning: t`If you disable energy logging, you will no longer receive usage insights or energy-saving tips.`,
      privacyScore: -4,
      comfortScore: 1,
    },
    {
      id: "smartAppLink",
      label: t`Connected to Smart App`,
      checked: true,
      warning: t`If you disable the Smart App connection, automations, scenes, and notifications will not be available.`,
      privacyScore: -3,
      comfortScore: 3,
    },
  ]);

  const handleOptionChange = (id: string, checked: boolean) => {
    const opt = options.find((o) => o.id === id);
    if (!checked && opt?.warning) {
      setShowWarning(opt.warning);
    }
    setOptions((prev) =>
            prev.map((o) => (o.id === id ? { ...o, checked } : o))
    );
  };

  const computeTotals = () => {
    const totalPrivacy = options.reduce(
            (sum, o) => sum + (o.checked ? o.privacyScore : 0),
            0
    );
    const totalComfort = options.reduce(
            (sum, o) => sum + (o.checked ? o.comfortScore : 0),
            0
    );
    return { privacy: totalPrivacy, comfort: totalComfort };
  };

  const handleSubmit = () => {
    const totals = computeTotals();
    setCalculatedScores(totals);

    const privacyLoss = Math.abs(Math.min(0, totals.privacy));
    if (privacyLoss > totals.comfort) {
      setShowReconfigureWarning(true);
    } else {
      gameService.changeScore(totals.privacy, "privacy");
      gameService.changeScore(totals.comfort, "comfort");
      setShowSuccessMessage(true);
    }

    console.log(
            `SmartLights totals → Privacy: ${totals.privacy}, Comfort: ${totals.comfort}`
    );
  };

  const handleReconfigure = () => {
    setShowReconfigureWarning(false);
  };

  const handleConfirmSettings = () => {
    setShowReconfigureWarning(false);
    gameService.changeScore(calculatedScores.privacy, "privacy");
    gameService.changeScore(calculatedScores.comfort, "comfort");
    setShowSuccessMessage(true);
  };

  const closeWarning = () => setShowWarning(null);

  const handleSuccessMessageClose = () => {
    setShowSuccessMessage(false);
    onCompletion(true);
  };

  if (showDialogue) {
    return (
            <div className="modal-content">
              <h1><Trans>Smart Lights</Trans></h1>
              <div
                      style={{
                        marginBottom: "20px",
                        padding: "15px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "8px",
                      }}
              >
                <p style={{ color: "#333", margin: 0 }}>
                  <Trans>
                    Your smart lights have been reset to their default settings.
                    Uncheck the features you don’t need, and leave the ones that
                    improve your experience. Your decisions impact both privacy and comfort!
                  </Trans>
                </p>
              </div>
              <button
                      onClick={() => setShowDialogue(false)}
                      style={{ padding: "10px 20px", fontSize: "16px" }}
              >
                <Trans>Continue</Trans>
              </button>
            </div>
    );
  }

  return (
          <div className="modal-content">
            <h1><Trans>Smart Lights</Trans></h1>

            <div style={{ marginBottom: "20px" }}>
              <p>
                <Trans>Select which features should be enabled for your Smart Lights:</Trans>
              </p>
            </div>

            <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      marginBottom: "20px",
                    }}
            >
              {options.map((o) => (
                      <div
                              key={o.id}
                              style={{
                                marginBottom: "10px",
                                padding: "10px",
                                border: "1px solid #ddd",
                                borderRadius: "5px",
                              }}
                      >
                        <label
                                style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                        >
                          <input
                                  type="checkbox"
                                  checked={o.checked}
                                  onChange={(e) => handleOptionChange(o.id, e.target.checked)}
                                  style={{ marginRight: "10px", transform: "scale(1.2)" }}
                          />
                          <span>{o.label}</span>
                        </label>
                      </div>
              ))}
            </div>

            <button
                    onClick={handleSubmit}
                    style={{
                      padding: "12px 24px",
                      fontSize: "16px",
                    }}
            >
              <Trans>Apply Settings</Trans>
            </button>

            {/* Inline warning */}
            {showWarning && (
                    <div
                            style={{
                              position: "fixed",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "white",
                              padding: "20px",
                              border: "2px solid #ffc107",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              zIndex: 1000,
                              maxWidth: "420px",
                            }}
                    >
                      <h4 style={{ marginTop: 0, color: "#856404" }}>
                        <Trans>⚠️ Warning</Trans>
                      </h4>
                      <p style={{ marginBottom: "15px", color: "#333" }}>{showWarning}</p>
                      <button onClick={closeWarning} style={{ padding: "8px 16px" }}>
                        <Trans>Continue</Trans>
                      </button>
                    </div>
            )}

            {/* Privacy vs Comfort tradeoff modal */}
            {showReconfigureWarning && (
                    <div
                            style={{
                              position: "fixed",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "white",
                              padding: "24px",
                              border: "2px solid #dc3545",
                              borderRadius: "8px",
                              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                              zIndex: 1000,
                              maxWidth: "520px",
                            }}
                    >
                      <h4
                              style={{
                                marginTop: 0,
                                color: "#dc3545",
                                fontSize: "18px",
                                fontWeight: "bold",
                                marginBottom: "12px",
                              }}
                      >
                        <Trans>⚠️ Privacy Warning</Trans>
                      </h4>
                      <p
                              style={{
                                marginBottom: "20px",
                                color: "#333",
                                lineHeight: "1.5",
                                fontSize: "14px",
                              }}
                      >
                        <Trans>
                          Your current settings result in a higher privacy loss than comfort gain.
                          Do you want to reconfigure your choices?
                        </Trans>
                      </p>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button
                                onClick={handleReconfigure}
                                style={{
                                  padding: "10px 20px",
                                  backgroundColor: "#6c757d",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                        >
                          <Trans>Reconfigure</Trans>
                        </button>
                        <button
                                onClick={handleConfirmSettings}
                                style={{
                                  padding: "10px 20px",
                                  backgroundColor: "#dc3545",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                }}
                        >
                          <Trans>Continue Anyway</Trans>
                        </button>
                      </div>
                    </div>
            )}

            {/* Success modal */}
            {showSuccessMessage && (
                    <div
                            style={{
                              position: "fixed",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "white",
                              padding: "24px",
                              border: "2px solid #28a745",
                              borderRadius: "8px",
                              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                              zIndex: 1000,
                              maxWidth: "420px",
                            }}
                    >
                      <h4
                              style={{
                                marginTop: 0,
                                color: "#28a745",
                                fontSize: "18px",
                                fontWeight: "bold",
                                marginBottom: "12px",
                              }}
                      >
                        <Trans>✅ Device Configured</Trans>
                      </h4>
                      <p
                              style={{
                                marginBottom: "20px",
                                color: "#333",
                                lineHeight: "1.5",
                                fontSize: "14px",
                              }}
                      >
                        {calculatedScores.privacy < 0 &&
                        Math.abs(calculatedScores.privacy) > calculatedScores.comfort ? (
                                <Trans>Your Smart Lights have been configured with your chosen settings.</Trans>
                        ) : (
                                <Trans>Your Smart Lights are now configured with a good balance of privacy and comfort!</Trans>
                        )}
                      </p>
                      <button
                              onClick={handleSuccessMessageClose}
                              style={{
                                padding: "10px 20px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                      >
                        <Trans>Continue</Trans>
                      </button>
                    </div>
            )}
          </div>
  );
};