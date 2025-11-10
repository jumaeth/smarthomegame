import React, {useEffect, useMemo, useRef, useState} from "react";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import wallImg from "@/assets/smart-mirror/wall.png";
import robotBWImg from "@/assets/smart-mirror/robotBW.png";
import robotImg from "@/assets/smart-mirror/robot.png";
import heartBWImg from "@/assets/smart-mirror/hearrtBW.png";
import heartImg from "@/assets/smart-mirror/heart.png";
import groceriesBWImg from "@/assets/smart-mirror/groceriesBW.png";
import groceriesImg from "@/assets/smart-mirror/groceries.png";
import weatherBWImg from "@/assets/smart-mirror/weatherBW.png";
import weatherImg from "@/assets/smart-mirror/weather.png";
import {Assets, Texture} from "pixi.js";
import {Stage, TilingSprite} from "@pixi/react";

interface SmartMirrorProps {
  completeDevice: () => void;
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
  // cooking game style asset loading for a tiling brick background on the left side
  const [wallTexture, setWallTexture] = useState<Texture>(Texture.EMPTY);
  const [wallLoaded, setWallLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (wallTexture === Texture.EMPTY) {
      Assets.load(wallImg).then((tex) => {
        setWallTexture(tex);
        setWallLoaded(true);
      });
    }
  }, [wallTexture]);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: Math.max(0, Math.round(r.width)), height: Math.max(0, Math.round(r.height)) });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);
  const gameService = useGameService();
  const smartDevice: SmartDevice | undefined = gameService.getDeviceByName("SmartMirror");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [solvedApps, setSolvedApps] = useState<Record<string, boolean>>({});
  
  // Points accumulator (like SmartKitchen), will be multiplied by 1.5x at completion
  const totalPoints = useRef<{ privacy: number; comfort: number }>({ privacy: 0, comfort: 0 });

  const apps: AppConfig[] = useMemo(() => ([
    {
      id: "assistant",
      label: t`Shower Assistant`,
      iconBW: robotBWImg,
      icon: robotImg,
      providers: [
        { name: t`HomeAI`, permissions: [t`Voice`, t`Contacts`], features: [t`Routines`, t`Guest mode`], description: t`Full assistant with cross-device routines and cloud skills.`, retention: t`Assistant transcripts retained 18 months by default.`, security: t`Account-level encryption, shared with enabled skills.`},
        { name: t`Helper+`, permissions: [t`Location`, t`Calendar`], features: [t`Commute aware`, t`Auto warm-up`], description: t`Contextual assistant optimized for routines around your schedule.`, retention: t`Calendar metadata stored 6 months for patterns.`, security: t`Scopes limited; background location adjustable.`},
        { name: t`LocalHelper`, permissions: [t`Local storage only`], features: [t`No cloud`, t`Custom scenes`], description: t`Private-by-design assistant without cloud dependencies.`, retention: t`No cloud logs. Local logs rotate weekly.`, security: t`Runs offline; LAN-only control.`},
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

  // Track provider exploration per app
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
      // Apply accumulated points multiplied by 1.5x (SmartMirror scores 1.5x SmartKitchen)
      const privacyScore = totalPoints.current.privacy || 0;
      const comfortScore = totalPoints.current.comfort || 0;
            
      // Apply points using gameService.changeScore
      if (privacyScore) {
        gameService.changeScore(privacyScore, 'privacy');
      }
      if (comfortScore) {
        gameService.changeScore(comfortScore, 'comfort');
      }
      
      // Save to statBlock like SmartKitchen does
      smartDevice.getStatBlock().setValue("Smart Mirror Points", privacyScore);
      smartDevice.getStatBlock().stopTimer();
      gameService.completeDevice("SmartMirror");
      completeDevice();
    }
  }, [allSolved, completeDevice, gameService, smartDevice]);

  const handleProviderSelect = (appId: string, provider: Provider) => {
    if (!hasVisitedAllProviders(appId)) return;
    setSolvedApps(prev => ({ ...prev, [appId]: true }));
    setSelectedAppId(null);
    
    // Accumulate points - scale similar to SmartKitchen (which multiplies by 5 in ingredients stage)
    // Base values per app choice (before 1.5x multiplier)
    // Privacy: fewer permissions = better privacy (+5), more permissions = worse privacy (-5)
    // Comfort: more features = better comfort (+3), fewer features = less comfort (+1)
    const privacyDelta = provider.permissions.length <= 1 ? 5 : provider.permissions.length === 2 ? 0 : -5;
    const comfortDelta = provider.features.length >= 2 ? 3 : provider.features.length === 1 ? 1 : 0;
    
    // Ensure we're working with valid numbers
    const currentPrivacy = totalPoints.current.privacy || 0;
    const currentComfort = totalPoints.current.comfort || 0;
    
    totalPoints.current.privacy = currentPrivacy + (privacyDelta || 0);
    totalPoints.current.comfort = currentComfort + (comfortDelta || 0);    
  };

  return (
          <div className="modal-content text-gray-900">
            <p><Trans>Choose a provider for each app. Compare details, then make your choices.</Trans></p>

            <div ref={containerRef} className="w-[960px] h-[560px] max-w-[90vw] my-3 mx-auto bg-transparent border border-blue-200 shadow-md relative overflow-hidden">
              {/* Full background tiled brick, like cooking game */}
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
                {/* Left: mirror and apps (single full-plane background to avoid offsets) */}
                <div className="relative overflow-hidden">
                  {/* Mirror only on left */}
                  <div className="absolute left-[8%] top-[10%] w-4/5 h-4/5 bg-gradient-to-b from-slate-200 to-slate-100 shadow-[inset_0_0_30px_rgba(0,0,0,0.25)] border-8 border-slate-400 z-[1]"/>

                  {/* Smaller app tiles inside mirror */}
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

                {/* Right: provider list on white background */}
                <div className="bg-white border-l border-gray-200 p-3 min-h-[210px] overflow-y-auto">
                  {!selectedAppId && (
                          <div className="text-gray-500">
                            <Trans>Select an app on the left to see providers.</Trans>
                          </div>
                  )}
                  {selectedAppId && (
                          <div>
                            <h2 className="mt-0">{apps.find(a => a.id === selectedAppId)?.label}</h2>
                            {(apps.find(a => a.id === selectedAppId)?.providers || []).map((p) => {
                              const isExpanded = expanded[selectedAppId] === p.name;
                              const allVisited = hasVisitedAllProviders(selectedAppId);
                              return (
                                      <div key={p.name} className="border border-gray-200 mb-2.5 bg-gray-50">
                                        <button
                                                onClick={() => { setExpanded(prev => ({...prev, [selectedAppId]: isExpanded ? null : p.name})); markVisited(selectedAppId, p.name); }}
                                                className={`w-full text-left py-2.5 px-3 bg-slate-50 ${isExpanded ? 'border-b border-gray-200' : ''} cursor-pointer flex items-center justify-between text-gray-900`}
                                        >
                                          <strong>{p.name}</strong>
                                          <span className="text-xs text-gray-600">{isExpanded ? t`Hide` : t`Expand`}</span>
                                        </button>
                                        {isExpanded && (
                                                <div className="py-2.5 px-3">
                                                  <div className="text-gray-700 mb-1.5">{p.description}</div>
                                                  <div className="flex gap-4 mt-2">
                                                    <div className="flex-1">
                                                      <div className="text-gray-700 mb-1"><Trans>Permissions</Trans></div>
                                                      <ul className="m-0 pl-[18px]">
                                                        {p.permissions.map((perm) => (
                                                                <li key={perm}>{perm}</li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                    <div className="flex-1">
                                                      <div className="text-gray-700 mb-1"><Trans>Features</Trans></div>
                                                      <ul className="m-0 pl-[18px]">
                                                        {p.features.map((f) => (
                                                                <li key={f}>{f}</li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                  <div className="grid grid-cols-2 gap-3 mt-2.5">
                                                    <div>
                                                      <div className="text-gray-700 mb-1"><Trans>Data retention</Trans></div>
                                                      <div>{p.retention}</div>
                                                    </div>
                                                    <div>
                                                      <div className="text-gray-700 mb-1"><Trans>Security</Trans></div>
                                                      <div>{p.security}</div>
                                                    </div>
                                                  </div>
                                                  <div className="text-right mt-2.5">
                                                    <button
                                                            onClick={() => handleProviderSelect(selectedAppId, p)}
                                                            disabled={!allVisited}
                                                            className={`${allVisited ? 'bg-yellow-400 text-gray-900 cursor-pointer' : 'bg-gray-200 text-gray-500 cursor-not-allowed'} border border-yellow-600 py-1.5 px-2.5`}
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

            <div className="mt-2 text-right">
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

