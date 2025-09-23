// SecurityCamera.tsx
import { useState } from "react";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";
import { CaptchaComponent } from "@/components/mini-game/CaptchaComponent.tsx";
import { useGameService } from "@/hooks/gameService/useGameService.tsx";

type onCompletionCallback = () => void;

interface CameraOption {
  id: string;
  label: string;
  checked: boolean;
  warning?: string;
  privacyScore: number;
  comfortScore: number;
}

export const SecurityCamera = ({ completeDevice }: { completeDevice: onCompletionCallback }) => {
  const gameService = useGameService();

  // Frame flow: 0 = settings, 1 = placements captcha
  const [frame, setFrame] = useState(0);

  // SmartTV-style UI state for frame 0 (settings)
  const [showIntro, setShowIntro] = useState(true);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [showReconfigureWarning, setShowReconfigureWarning] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Keep the calculated totals to apply on confirm (frame 0)
  const [calculatedScores, setCalculatedScores] = useState({ privacy: 0, comfort: 0 });

  // Internet access (true), Phone usage (true), Transfer image data (false), Image recognition (false).
  const [options, setOptions] = useState<CameraOption[]>([
    {
      id: "internetAccess",
      label: t`Internet access enabled`,
      checked: true,
      warning: t`If you disable Internet access, remote monitoring and notifications will not work.`,
      privacyScore: -5,
      comfortScore: 3,
    },
    {
      id: "phoneUsage",
      label: t`Phone control enabled`,
      checked: true,
      warning: t`If you disable phone control, you won’t be able to manage the camera from your phone.`,
      privacyScore: -2,
      comfortScore: 4,
    },
    {
      id: "imageTransfer",
      label: t`Transfer image data for storage/processing`,
      checked: false,
      warning: t`If you disable image transfer, cloud-based storage and advanced analytics will be unavailable.`,
      // Leaving this ON can be quite invasive
      privacyScore: -8,
      comfortScore: 2,
    },
    {
      id: "imageRecognition",
      label: t`Image recognition enabled`,
      checked: false,
      warning: t`If you disable image recognition, the system cannot auto-tag events or distinguish people/objects.`,
      privacyScore: -6,
      comfortScore: 2,
    },
  ]);

  // SmartTV-like toggle handler: show warning when turning OFF something
  const handleOptionChange = (id: string, checked: boolean) => {
    const opt = options.find((o) => o.id === id);
    if (!checked && opt?.warning) setShowWarning(opt.warning);
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, checked } : o)));
  };

  const computeTotals = () => {
    const privacy = options.reduce((sum, o) => sum + (o.checked ? o.privacyScore : 0), 0);
    const comfort = options.reduce((sum, o) => sum + (o.checked ? o.comfortScore : 0), 0);
    return { privacy, comfort };
  };

  const applyScores = (privacy: number, comfort: number) => {
    gameService.changeScore(privacy, "privacy");
    gameService.changeScore(comfort, "comfort");
  };

  // Submit (frame 0)
  const handleSubmitSettings = () => {
    const totals = computeTotals();
    setCalculatedScores(totals);

    const privacyLoss = Math.abs(Math.min(0, totals.privacy));
    if (privacyLoss > totals.comfort) {
      setShowReconfigureWarning(true);
    } else {
      applyScores(totals.privacy, totals.comfort);
      setShowSuccessMessage(true);
    }

    console.log(`SecurityCamera (settings) → Privacy: ${totals.privacy}, Comfort: ${totals.comfort}`);
  };

  const handleReconfigure = () => setShowReconfigureWarning(false);

  const handleConfirmSettings = () => {
    setShowReconfigureWarning(false);
    applyScores(calculatedScores.privacy, calculatedScores.comfort);
    setShowSuccessMessage(true);
  };

  const closeWarning = () => setShowWarning(null);

  // After success (frame 0), continue to frame 1 (captcha)
  const handleSettingsSuccessClose = () => {
    setShowSuccessMessage(false);
    setFrame(1);
  };

  // Frame 1: Captcha mini-game — award an extra bonus on success
  const handleCaptchaCompletion = (isCompleted: boolean) => {
    if (isCompleted) {
      applyScores(+6, +2);
      completeDevice();
    }
  };

  return (
          <div>
            <h1><Trans>Security Camera</Trans></h1>
            <div className="modal-content">
              {/* FRAME 0 — settings (SmartTV-style) */}
              {frame === 0 && (
                      <>
                        {showIntro ? (
                                <div>
                                  <p>
                                    <Trans>
                                      Your camera settings were reset to defaults. Disable features you don’t need and keep the ones that
                                      improve your experience. Your choices affect both privacy and comfort!
                                    </Trans>
                                  </p>
                                  <button
                                          onClick={() => setShowIntro(false)}
                                          style={{ padding: "10px 20px", fontSize: "16px" }}
                                  >
                                    <Trans>Continue</Trans>
                                  </button>
                                </div>
                        ) : (
                                <>
                                  <div style={{ marginBottom: "12px" }}>
                                    <p><Trans>Select which camera features should be enabled:</Trans></p>
                                  </div>

                                  <div style={{ maxHeight: 400, overflowY: "auto", marginBottom: 20 }}>
                                    {options.map((o) => (
                                            <div
                                                    key={o.id}
                                                    style={{
                                                      marginBottom: 10,
                                                      padding: 10,
                                                      border: "1px solid #ddd",
                                                      borderRadius: 5,
                                                    }}
                                            >
                                              <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                                <input
                                                        type="checkbox"
                                                        checked={o.checked}
                                                        onChange={(e) => handleOptionChange(o.id, e.target.checked)}
                                                        style={{ marginRight: 10, transform: "scale(1.2)" }}
                                                />
                                                <span>{o.label}</span>
                                              </label>
                                            </div>
                                    ))}
                                  </div>

                                  <button
                                          onClick={handleSubmitSettings}
                                          style={{ padding: "12px 24px", fontSize: "16px" }}
                                  >
                                    <Trans>Apply Settings</Trans>
                                  </button>

                                  {/* Inline warning on toggle */}
                                  {showWarning && (
                                          <div
                                                  style={{
                                                    position: "fixed",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    backgroundColor: "white",
                                                    padding: 20,
                                                    border: "2px solid #ffc107",
                                                    borderRadius: 8,
                                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                    zIndex: 1000,
                                                    maxWidth: 460,
                                                  }}
                                          >
                                            <h4 style={{ marginTop: 0, color: "#856404" }}>
                                              <Trans>⚠️ Warning</Trans>
                                            </h4>
                                            <p style={{ marginBottom: 15, color: "#333" }}>{showWarning}</p>
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
                                                    padding: 24,
                                                    border: "2px solid #dc3545",
                                                    borderRadius: 8,
                                                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                                                    zIndex: 1000,
                                                    maxWidth: 540,
                                                  }}
                                          >
                                            <h4
                                                    style={{
                                                      marginTop: 0,
                                                      color: "#dc3545",
                                                      fontSize: 18,
                                                      fontWeight: "bold",
                                                      marginBottom: 12,
                                                    }}
                                            >
                                              <Trans>⚠️ Privacy Warning</Trans>
                                            </h4>
                                            <p
                                                    style={{
                                                      marginBottom: 20,
                                                      color: "#333",
                                                      lineHeight: 1.5,
                                                      fontSize: 14,
                                                    }}
                                            >
                                              <Trans>
                                                Your current selection results in a higher privacy loss than comfort gain.
                                                Do you want to reconfigure your choices?
                                              </Trans>
                                            </p>
                                            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                                              <button
                                                      onClick={handleReconfigure}
                                                      style={{
                                                        padding: "10px 20px",
                                                        backgroundColor: "#6c757d",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: 4,
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
                                                        borderRadius: 4,
                                                        cursor: "pointer",
                                                      }}
                                              >
                                                <Trans>Continue Anyway</Trans>
                                              </button>
                                            </div>
                                          </div>
                                  )}

                                  {/* Success modal → proceed to Captcha (frame 1) */}
                                  {showSuccessMessage && (
                                          <div
                                                  style={{
                                                    position: "fixed",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    backgroundColor: "white",
                                                    padding: 24,
                                                    border: "2px solid #28a745",
                                                    borderRadius: 8,
                                                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                                                    zIndex: 1000,
                                                    maxWidth: 460,
                                                  }}
                                          >
                                            <h4
                                                    style={{
                                                      marginTop: 0,
                                                      color: "#28a745",
                                                      fontSize: 18,
                                                      fontWeight: "bold",
                                                      marginBottom: 12,
                                                    }}
                                            >
                                              <Trans>✅ Settings Applied</Trans>
                                            </h4>
                                            <p
                                                    style={{
                                                      marginBottom: 20,
                                                      color: "#333",
                                                      lineHeight: 1.5,
                                                      fontSize: 14,
                                                    }}
                                            >
                                              {calculatedScores.privacy < 0 &&
                                              Math.abs(calculatedScores.privacy) > calculatedScores.comfort ? (
                                                      <Trans>Your camera has been configured with your chosen settings.</Trans>
                                              ) : (
                                                      <Trans>Your camera is now configured with a good balance of privacy and comfort!</Trans>
                                              )}
                                            </p>
                                            <button
                                                    onClick={handleSettingsSuccessClose}
                                                    style={{
                                                      padding: "10px 20px",
                                                      backgroundColor: "#28a745",
                                                      color: "white",
                                                      border: "none",
                                                      borderRadius: 4,
                                                      cursor: "pointer",
                                                    }}
                                            >
                                              <Trans>Continue</Trans>
                                            </button>
                                          </div>
                                  )}
                                </>
                        )}
                      </>
              )}

              {/* FRAME 1 — placements Captcha (awards a bonus on success) */}
              {frame === 1 && (
                      <>
                        <p>
                          <Trans>
                            You should rearrange your surveillance cameras. The smart home has already made a preselection. Do you
                            agree with it? Select all the camera placements you want to remove again.
                          </Trans>
                        </p>
                        <CaptchaComponent
                                pictureFolder="camera-placements"
                                solutions={[
                                  true,
                                  true,
                                  true,
                                  t`This is a bad place for a camera because reasons`,
                                  true,
                                  t`This is a bad place for a camera because reasons`,
                                  true,
                                  true,
                                  t`This is a bad place for a camera because reasons`,
                                  t`This is a bad place for a camera because reasons`,
                                  true,
                                  true,
                                  true,
                                ]}
                                onComplete={handleCaptchaCompletion}
                        />
                      </>
              )}
            </div>
          </div>
  );
};
