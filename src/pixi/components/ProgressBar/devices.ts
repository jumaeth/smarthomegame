import tvIcon from "@/assets/progressBar/progressBarIcons/icons/tv.png";
import tvSilhouette from "@/assets/progressBar/progressBarIcons/silhouettes/tvSilhouette.png";

import kitchenIcon from "@/assets/progressBar/progressBarIcons/icons/cooking.png";
import kitchenSilhouette from "@/assets/progressBar/progressBarIcons/silhouettes/cookingSilhouette.png";

import secCamIcon from "@/assets/progressBar/progressBarIcons/icons/secCam.png";
import secCamSilhouette from "@/assets/progressBar/progressBarIcons/silhouettes/secCamSilhouette.png";

import lightsIcon from "@/assets/progressBar/progressBarIcons/icons/lights.png";
import lightsSilhouette from "@/assets/progressBar/progressBarIcons/silhouettes/lightsSilhouette.png";

import hubIcon from "@/assets/progressBar/progressBarIcons/icons/hub.png";
import hubSilhouette from "@/assets/progressBar/progressBarIcons/silhouettes/hubSilhouette.png";

import showerIcon from "@/assets/progressBar/progressBarIcons/icons/shower.png";
import showerSilhouette from "@/assets/progressBar/progressBarIcons/silhouettes/showerSilhouette.png";

import mirrorIcon from "@/assets/progressBar/progressBarIcons/icons/mirror.png";
import mirrorSilhouette from "@/assets/progressBar/progressBarIcons/silhouettes/mirrorSilhouette.png";

type device = {
  name: string;
  icon: string;
  silhouette: string;
}
export function getDeviceTexture(name: string, completed: boolean): string{
  const devices: device[] = [
    {
      name:"SmartTv",
      icon: tvIcon,
      silhouette: tvSilhouette
    } as device,

    {
      name:"SmartShower",
      icon: showerIcon,
      silhouette: showerSilhouette
    } as device,

    {
      name:"SmartKitchen",
      icon: kitchenIcon,
      silhouette: kitchenSilhouette
    } as device,

    {
      name:"SecurityCamera",
      icon: secCamIcon,
      silhouette: secCamSilhouette
    } as device,

    {
      name:"SmartLights",
      icon: lightsIcon,
      silhouette: lightsSilhouette
    } as device,

    {
      name:"SmartHomeHub",
      icon: hubIcon,
      silhouette: hubSilhouette
    } as device,

    {
      name:"SmartMirror",
      icon: mirrorIcon,
      silhouette: mirrorSilhouette
    } as device,

  ]

  const texture = completed ? devices.find(d => d.name === name)?.icon : devices.find(d => d.name === name)?.silhouette;
  return texture ? texture : "";

}