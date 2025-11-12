import React, {useEffect, useMemo, useRef, useState} from "react";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import wallImg from "@/assets/smart-mirror/wall.png";
import robotBWImg from "@/assets/smart-mirror/robotBW.png";
import robotImg from "@/assets/smart-mirror/robot.png";
import heartBWImg from "@/assets/smart-mirror/heartBW.png";
import heartImg from "@/assets/smart-mirror/heart.png";
import groceriesBWImg from "@/assets/smart-mirror/groceriesBW.png";
import groceriesImg from "@/assets/smart-mirror/groceries.png";
import weatherBWImg from "@/assets/smart-mirror/weatherBW.png";
import weatherImg from "@/assets/smart-mirror/weather.png";
import {Assets, Texture} from "pixi.js";
import {Stage, TilingSprite} from "@pixi/react";

interface SmartMirrorProps {
  completeDevice?: () => void;
}

type Provider = {
  name: string;
  permissions: string[];
  features: string[];
  description: string;
  retention: string;
  security: string;
};

type AppConfig = {
  id: string;
  label: string;
  iconBW: string;
  icon: string;
  providers: Provider[];
};

export const SmartMirror: React.FC<SmartMirrorProps> = ({ completeDevice }) => {
  const [wallTexture, setWallTexture] = useState<Texture>(Texture.EMPTY);
  const [wallLoaded, setWallLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (wallTexture === Texture.EMPTY) {
      Assets.load(wallImg)
              .then((result) => {
                setWallTexture(result);
                setWallLoaded(true);
              });
    }
  }, [wallTexture]);

  useEffect(() => {
    setContainerSize({
      width: 850,
      height: 520
    });
  }, []);
  const gameService = useGameService();
  const smartDevice: SmartDevice | undefined = gameService.getDeviceByName("SmartMirror");
  const [showDialogue, setShowDialogue] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [solvedApps, setSolvedApps] = useState<Record<string, boolean>>({});
  
  const totalPoints = useRef<{ privacy: number; comfort: number }>({ privacy: 0, comfort: 0 });

  const apps: AppConfig[] = useMemo(() => ([
    {
      id: "assistant",
      label: t`Styling Assistant`,
      iconBW: robotBWImg,
      icon: robotImg,
      providers: [
        { name: t`StyleAI`, permissions: [t`Camera`, t`Calendar`], features: [t`Outfit suggestions`, t`Weather-based styling`], description: t`Full styling assistant with AI-powered fashion recommendations and calendar integration.`, retention: t`Style preferences and photos retained 18 months for learning.`, security: t`Account-level encryption, shared with fashion partners.`},
        { name: t`FashionHelper+`, permissions: [t`Location`, t`Purchase history`], features: [t`Trend alerts`, t`Wardrobe sync`], description: t`Contextual styling assistant that adapts to local trends and your wardrobe.`, retention: t`Purchase data stored 6 months for recommendations.`, security: t`Scopes limited; location data anonymized.`},
        { name: t`LocalStylist`, permissions: [t`Local storage only`], features: [t`No cloud`, t`Offline suggestions`], description: t`Private-by-design styling assistant without cloud dependencies.`, retention: t`No cloud logs. Local preferences rotate weekly.`, security: t`Runs offline; no external connections.`},
      ],
    },
    {
      id: "health",
      label: t`Health Monitor`,
      iconBW: heartBWImg,
      icon: heartImg,
      providers: [
        { name: t`FitPulse`, permissions: [t`Heart rate`, t`Temperature`], features: [t`Trend charts`, t`Alerts`], description: t`Comprehensive metrics with cloud syncing and insights.`, retention: t`Health metrics retained 12 months for comparisons.`, security: t`PHI safeguards, regional data centers.`},
        { name: t`WellTrack`, permissions: [t`Motion`, t`Sleep data`], features: [t`Daily insights`, t`Reminders`], description: t`Lifestyle-focused with habit reminders and gentle nudges.`, retention: t`Aggregated usage retained 90 days.`, security: t`Aggregates before upload; opt-out analytics.`},
        { name: t`MinimalCare`, permissions: [t`Anonymous stats`], features: [t`Local processing`, t`Export only`], description: t`Minimal tracking; all metrics processed locally.`, retention: t`No cloud storage. Exports only when you trigger it.`, security: t`Local-only, sandboxed.`}
      ],
    },
    {
      id: "shop",
      label: t`Supply Refill`,
      iconBW: groceriesBWImg,
      icon: groceriesImg,
      providers: [
        { name: t`QuickBuy`, permissions: [t`Payment`, t`Purchase history`], features: [t`Auto-order`, t`Coupons`], description: t`One-tap restocks with vendor integrations.`, retention: t`Orders retained per legal requirements (up to 10 years).`, security: t`PCI-DSS compliant; tokenized payments.`},
        { name: t`EcoStore`, permissions: [t`Network`, t`Anonymous usage`], features: [t`Sustainable picks`, t`Price alerts`], description: t`Marketplace highlighting eco alternatives and best prices.`, retention: t`Anonymous analytics kept 60 days.`, security: t`Anonymized telemetry; private browsing mode.`},
        { name: t`ManualOnly`, permissions: [t`None`], features: [t`Manual checkout`, t`Export cart`], description: t`No vendor link; you confirm orders manually.`, retention: t`No history. Optional local export only.`, security: t`No external connections.`},
      ],
    },
    {
      id: "weather",
      label: t`Weather`,
      iconBW: weatherBWImg,
      icon: weatherImg,
      providers: [
        { name: t`SkyCast`, permissions: [t`Location`], features: [t`Hyperlocal forecast`, t`Rain alerts`], description: t`Popular weather feed with hyperlocal nowcasts.`, retention: t`Location lookups cached 24h.`, security: t`Requests via HTTPS; IP anonymization enabled.`},
        { name: t`OpenWeather+`, permissions: [t`Network`], features: [t`Open data sources`, t`Hourly charts`], description: t`Open-data-centric weather with transparent models.`, retention: t`Aggregated request stats kept 30 days.`, security: t`No account needed; telemetry opt-out.`},
        { name: t`LocalMeteo`, permissions: [t`None`], features: [t`Offline cache`, t`Sensor-only`], description: t`Local-only readings from your home sensors.`, retention: t`No cloud. Local logs rotate 14 days.`, security: t`No network communication.`},
      ],
    },
  ]), []);

  const allSolved = useMemo(() => apps.every(a => solvedApps[a.id]), [apps, solvedApps]);

  const [expanded, setExpanded] = useState<Record<string, string | null>>({});
  const [visited, setVisited] = useState<Record<string, Record<string, boolean>>>({});

  const markVisited = (appId: string, providerName: string) => {
    setVisited(prev => ({
      ...prev,
      [appId]: {
        ...(prev[appId] || {}),
        [providerName]: true,
      },
    }));
  };

  const hasVisitedAllProviders = (appId: string): boolean => {
    const current = apps.find(a => a.id === appId);
    if (!current) return false;
    const vis = visited[appId] || {};
    return current.providers.every(p => !!vis[p.name]);
  };

  React.useEffect(() => {
    if (!smartDevice) return;
    smartDevice.getStatBlock().startTimer();
  }, [smartDevice]);

  React.useEffect(() => {
    if (!smartDevice) return;
    if (allSolved) {
      const privacyScore = totalPoints.current.privacy || 0;
      const comfortScore = totalPoints.current.comfort || 0;
            
      if (privacyScore) {
        gameService.changeScore(privacyScore, 'privacy');
      }
      if (comfortScore) {
        gameService.changeScore(comfortScore, 'comfort');
      }
      
      smartDevice.getStatBlock().setValue("Smart Mirror Points", privacyScore);
      smartDevice.getStatBlock().stopTimer();
      gameService.completeDevice("SmartMirror");
      completeDevice?.();
    }
  }, [allSolved, completeDevice, gameService, smartDevice]);

  const handleProviderSelect = (appId: string, provider: Provider) => {
    if (!hasVisitedAllProviders(appId)) return;
    setSolvedApps(prev => ({ ...prev, [appId]: true }));
    setSelectedAppId(null);
    
    const privacyDelta = provider.permissions.length <= 1 ? 5 : provider.permissions.length === 2 ? 0 : -5;
    const comfortDelta = provider.features.length >= 2 ? 3 : provider.features.length === 1 ? 1 : 0;
    
    const currentPrivacy = totalPoints.current.privacy || 0;
    const currentComfort = totalPoints.current.comfort || 0;
    
    totalPoints.current.privacy = currentPrivacy + (privacyDelta || 0);
    totalPoints.current.comfort = currentComfort + (comfortDelta || 0);    
  };

  if (showDialogue) {
    return (
            <div className="flex flex-col items-center justify-center p-4">
              <h1 className="text-white text-3xl font-bold mb-8">
                <Trans>Smart Mirror Setup</Trans></h1>
              <div className="text-xl bg-white p-5 rounded-lg text-gray-700 w-full max-w-3xl mb-6">
                <p className="leading-relaxed">
                  <Trans>You want to look at yourself in the mirror, but the mirror is frosted because it isn't configured yet. You need to set up each app by choosing a provider. Compare the different options - your choices will affect both your privacy and comfort. Once you've configured all the apps, you can use the mirror.</Trans></p>
              </div>
              <button onClick={() => setShowDialogue(false)}
                      className="px-8 py-[10px] text-lg font-semibold bg-blue-600 hover:bg-blue-700
                      rounded-[30px] shadow-md transition-colors cursor-pointer text-white"
              >
                <Trans>Continue</Trans>
              </button>
            </div>
    );
  }

  return (
          <div className="modal-content text-white flex flex-col items-center justify-center w-full max-w-[1200px] h-[700px] max-h-[calc(90vh-100px)] box-border overflow-hidden mx-[25px]">
            <div ref={containerRef} className="bg-transparent border border-blue-200 shadow-md relative overflow-hidden mx-auto w-[850px] h-[520px] max-w-full max-h-full box-border">
              {wallLoaded && containerSize.width > 0 && containerSize.height > 0 && (
                      <div className="absolute inset-0 z-0">
                        <Stage
                                width={containerSize.width}
                                height={containerSize.height}
                        >
                          <TilingSprite
                                  texture={wallTexture}
                                  width={containerSize.width}
                                  height={containerSize.height}
                                  tilePosition={{ x: 0, y: 0 }}
                                  tileScale={{ x: 0.25, y: 0.25 }}
                          />
                        </Stage>
                      </div>
              )}
              <div className="grid grid-cols-2 gap-4 p-4 relative z-[1] h-full">
                <div className="relative overflow-hidden h-full">
                  <div className="absolute left-[8%] top-[10%] w-4/5 h-4/5 bg-gradient-to-b from-slate-200 to-slate-100 shadow-[inset_0_0_30px_rgba(0,0,0,0.25)] border-8 border-slate-400 z-[1]"/>
                  <div className="absolute left-[8%] top-[10%] w-4/5 h-4/5 grid grid-cols-2 gap-3 p-3 z-[2]">
                    {apps.map((app) => (
                            <button
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`bg-transparent border-none p-0 ${solvedApps[app.id] ? 'opacity-100' : 'opacity-60'} cursor-pointer flex items-center justify-center w-full h-full`}
                            >
                              <img
                                      src={solvedApps[app.id] ? app.icon : app.iconBW}
                                      alt={app.label}
                                      className="w-full h-full object-contain"
                              />
                            </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#2a2a2a] p-3 min-h-[210px] overflow-y-auto h-full">
                  {!selectedAppId && (
                          <div className="text-gray-400">
                            <Trans>Select an app on the left to see providers.</Trans>
                          </div>
                  )}
                  {selectedAppId && (
                          <div>
                            <h2 className="mt-0 text-white">{apps.find(a => a.id === selectedAppId)?.label}</h2>
                            {(apps.find(a => a.id === selectedAppId)?.providers || []).map((p) => {
                              const isExpanded = expanded[selectedAppId] === p.name;
                              const allVisited = hasVisitedAllProviders(selectedAppId);
                              return (
                                      <div key={p.name} className="border border-grey-400 rounded-md mb-3 p-3">
                                        <button
                                                onClick={() => { setExpanded(prev => ({...prev, [selectedAppId]: isExpanded ? null : p.name})); markVisited(selectedAppId, p.name); }}
                                                className={`w-full text-left py-2.5 px-3 ${isExpanded ? 'border-b border-gray-400 mb-2' : ''} cursor-pointer flex items-center justify-between text-white`}
                                        >
                                          <strong>{p.name}</strong>
                                          <span className="text-xs text-gray-400">{isExpanded ? t`Hide` : t`Expand`}</span>
                                        </button>
                                        {isExpanded && (
                                                <div className="py-2.5 px-3 overflow-visible">
                                                  <div className="text-gray-300 mb-1.5 break-words">{p.description}</div>
                                                  <div className="flex gap-4 mt-2">
                                                    <div className="flex-1 min-w-0">
                                                      <div className="text-gray-300 mb-1"><Trans>Permissions</Trans></div>
                                                      <ul className="m-0 pl-[18px] text-gray-300 break-words">
                                                        {p.permissions.map((perm) => (
                                                                <li key={perm} className="break-words">{perm}</li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                      <div className="text-gray-300 mb-1"><Trans>Features</Trans></div>
                                                      <ul className="m-0 pl-[18px] text-gray-300 break-words">
                                                        {p.features.map((f) => (
                                                                <li key={f} className="break-words">{f}</li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-3 mt-2.5">
                                                    <div className="min-w-0">
                                                      <div className="text-gray-300 mb-1"><Trans>Data retention</Trans></div>
                                                      <div className="text-gray-300 break-words">{p.retention}</div>
                                                    </div>
                                                    <div className="min-w-0">
                                                      <div className="text-gray-300 mb-1"><Trans>Security</Trans></div>
                                                      <div className="text-gray-300 break-words">{p.security}</div>
                                                    </div>
                                                  </div>
                                                  <div className="text-right mt-2.5">
                                                    <button
                                                            onClick={() => handleProviderSelect(selectedAppId, p)}
                                                            disabled={!allVisited}
                                                            className={`${allVisited ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'} px-8 py-[10px] text-lg font-semibold rounded-[30px] shadow-md transition-colors`}
                                                    >
                                                      <Trans>Choose</Trans>
                                                    </button>
                                                  </div>
                                                </div>
                                        )}
                                      </div>
                              );
                            })}
                          </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 text-center w-full">
              {allSolved ? (
                      <span className="text-green-600 font-semibold"><Trans>All apps configured!</Trans></span>
              ) : (
                      <span className="text-gray-500"><Trans>Solve all 4 apps</Trans></span>
              )}
            </div>
          </div>
  );
};

export default SmartMirror;

