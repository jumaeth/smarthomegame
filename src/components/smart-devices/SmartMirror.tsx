import React, {useEffect, useMemo, useRef, useState} from "react";
import {Trans} from "@lingui/react/macro";
import {t} from "@lingui/core/macro";
import {useGameService} from "@/hooks/gameService/useGameService.tsx";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import bathroomOverlayImg from "@/assets/levels/bathroom/bathroom_overlay.png";
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
  const leftCanvasRef = useRef<HTMLDivElement | null>(null);
  const [leftSize, setLeftSize] = useState({ width: 0, height: 0 });

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
      if (leftCanvasRef.current) {
        const rect = leftCanvasRef.current.getBoundingClientRect();
        setLeftSize({ width: Math.max(0, Math.round(rect.width)), height: Math.max(0, Math.round(rect.height)) });
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    if (leftCanvasRef.current) ro.observe(leftCanvasRef.current);
    return () => ro.disconnect();
  }, []);
  const gameService = useGameService();
  const smartDevice: SmartDevice | undefined = gameService.getDeviceByName("SmartMirror");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [solvedApps, setSolvedApps] = useState<Record<string, boolean>>({});
  
  // Points accumulator (like SmartKitchen), will be multiplied by 1.5x at completion
  const totalPoints = useRef<{ privacy: number; comfort: number }>({ privacy: 0, comfort: 0 });
  const pointsApplied = useRef<boolean>(false);

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
    if (allSolved && !pointsApplied.current) {
      // Guard against multiple executions
      pointsApplied.current = true;
      
      // Apply accumulated points multiplied by 1.5x (SmartMirror scores 1.5x SmartKitchen)
      const basePrivacy = totalPoints.current.privacy || 0;
      const baseComfort = totalPoints.current.comfort || 0;
      const privacyScore = Math.round((basePrivacy || 0) * 1.5);
      const comfortScore = Math.round((baseComfort || 0) * 1.5);
      
      console.log('[SmartMirror] Applying points:', { 
        basePrivacy, 
        baseComfort, 
        privacyScore, 
        comfortScore
      });
      
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
    
    console.log(`[SmartMirror] Selected ${provider.name} for ${appId}:`, {
      permissions: provider.permissions.length,
      features: provider.features.length,
      privacyDelta,
      comfortDelta,
      totalPrivacy: totalPoints.current.privacy,
      totalComfort: totalPoints.current.comfort
    });
  };

  return (
          <div className="modal-content" style={{ color: '#111' }}>
            <p><Trans>Choose a provider for each app. Compare details, then make your choices.</Trans></p>

            <div ref={containerRef} style={{
              width: '960px',
              height: '560px',
              maxWidth: '90vw',
              margin: '12px auto',
              background: 'transparent',
              border: '1px solid #c2d4ff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Full background tiled brick, like cooking game */}
              {wallLoaded && containerSize.width > 0 && containerSize.height > 0 && (
                      <div style={{position: 'absolute', inset: 0, zIndex: 0}}>
                        <Stage
                                width={containerSize.width}
                                height={containerSize.height}
                                options={{ backgroundAlpha: 0, roundPixels: true, resolution: Math.min(2, window.devicePixelRatio || 1) }}
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
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', position: 'relative', zIndex: 1, height: '100%'}}>
                {/* Left: mirror and apps (single full-plane background to avoid offsets) */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  {/* Mirror only on left */}
                  <div style={{
                    position: 'absolute',
                    left: '8%', top: '10%',
                    width: '80%', height: '80%',
                    background: 'linear-gradient(180deg, #cfd8e3 0%, #e6ecf4 100%)',
                    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.25)',
                    border: '8px solid #a8b3bf',
                    zIndex: 1
                  }}/>

                  {/* Smaller app tiles inside mirror */}
                  <div style={{
                    position: 'absolute', left: '8%', top: '10%', width: '80%', height: '80%',
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', zIndex: 2
                  }}>
                    {apps.map((app) => (
                            <button
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    style={{
                                      background: 'transparent',
                                      border: 'none',
                                      padding: 0,
                                      opacity: solvedApps[app.id] ? 1 : 0.6,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '100%',
                                      height: '100%'
                                    }}
                            >
                              <img
                                      src={solvedApps[app.id] ? app.icon : app.iconBW}
                                      alt={app.label}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                      }}
                              />
                            </button>
                    ))}
                  </div>
                </div>

                {/* Right: provider list on white background */}
                <div style={{ background: '#fff', borderLeft: '1px solid #eee', padding: '12px', minHeight: '210px', overflowY: 'auto' }}>
                  {!selectedAppId && (
                          <div style={{color: '#555'}}>
                            <Trans>Select an app on the left to see providers.</Trans>
                          </div>
                  )}
                  {selectedAppId && (
                          <div>
                            <h2 style={{marginTop: 0}}>{apps.find(a => a.id === selectedAppId)?.label}</h2>
                            {(apps.find(a => a.id === selectedAppId)?.providers || []).map((p) => {
                              const isExpanded = expanded[selectedAppId] === p.name;
                              const allVisited = hasVisitedAllProviders(selectedAppId);
                              return (
                                      <div key={p.name} style={{border: '1px solid #e5e7eb', marginBottom: '10px', background: '#fafafa'}}>
                                        <button
                                                onClick={() => { setExpanded(prev => ({...prev, [selectedAppId]: isExpanded ? null : p.name})); markVisited(selectedAppId, p.name); }}
                                                style={{
                                                  width: '100%',
                                                  textAlign: 'left',
                                                  padding: '10px 12px',
                                                  background: '#f8fafc',
                                                  borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none',
                                                  cursor: 'pointer',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'space-between',
                                                  color: '#111'
                                                }}
                                        >
                                          <strong>{p.name}</strong>
                                          <span style={{fontSize: '12px', color: '#666'}}>{isExpanded ? t`Hide` : t`Expand`}</span>
                                        </button>
                                        {isExpanded && (
                                                <div style={{padding: '10px 12px'}}>
                                                  <div style={{color: '#333', marginBottom: '6px'}}>{p.description}</div>
                                                  <div style={{display: 'flex', gap: '16px', marginTop: '8px'}}>
                                                    <div style={{flex: 1}}>
                                                      <div style={{color: '#444', marginBottom: '4px'}}><Trans>Permissions</Trans></div>
                                                      <ul style={{margin: 0, paddingLeft: '18px'}}>
                                                        {p.permissions.map((perm) => (
                                                                <li key={perm}>{perm}</li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                    <div style={{flex: 1}}>
                                                      <div style={{color: '#444', marginBottom: '4px'}}><Trans>Features</Trans></div>
                                                      <ul style={{margin: 0, paddingLeft: '18px'}}>
                                                        {p.features.map((f) => (
                                                                <li key={f}>{f}</li>
                                                        ))}
                                                      </ul>
                                                    </div>
                                                  </div>
                                                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px'}}>
                                                    <div>
                                                      <div style={{color: '#444', marginBottom: '4px'}}><Trans>Data retention</Trans></div>
                                                      <div>{p.retention}</div>
                                                    </div>
                                                    <div>
                                                      <div style={{color: '#444', marginBottom: '4px'}}><Trans>Security</Trans></div>
                                                      <div>{p.security}</div>
                                                    </div>
                                                  </div>
                                                  <div style={{textAlign: 'right', marginTop: '10px'}}>
                                                    <button
                                                            onClick={() => handleProviderSelect(selectedAppId, p)}
                                                            disabled={!allVisited}
                                                            style={{
                                                              background: allVisited ? '#ffd54d' : '#e5e7eb',
                                                              color: allVisited ? '#111' : '#888',
                                                              border: '1px solid #e0b000',
                                                              padding: '6px 10px',
                                                              cursor: allVisited ? 'pointer' : 'not-allowed'
                                                            }}
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

            <div style={{marginTop: '8px', textAlign: 'right'}}>
              {allSolved ? (
                      <span style={{color: '#0f9d58', fontWeight: 600}}><Trans>All apps configured!</Trans></span>
              ) : (
                      <span style={{color: '#555'}}><Trans>Solve all 4 apps</Trans></span>
              )}
            </div>
          </div>
  );
};

export default SmartMirror;

