type device = {
  name: string;
  icon: string;
  silhouette: string;
}
export function getDeviceTexture(name: string, completed: boolean): string{
  const devices: device[] = [
    {
      name:"SmartTv",
      icon:"/src/assets/progressBar/progressBarIcons/icons/tv.png",
      silhouette: "/src/assets/progressBar/progressBarIcons/silhouettes/tvSilhouette.png"
    } as device,

    {
      name:"SmartKitchen",
      icon:"/src/assets/progressBar/progressBarIcons/icons/cooking.png",
      silhouette: "/src/assets/progressBar/progressBarIcons/silhouettes/cookingSilhouette.png"
    } as device,

    {
      name:"SecurityCamera",
      icon:"/src/assets/progressBar/progressBarIcons/icons/secCam.png",
      silhouette: "/src/assets/progressBar/progressBarIcons/silhouettes/secCamSilhouette.png"
    } as device,

    {
      name:"SmartLights",
      icon:"/src/assets/progressBar/progressBarIcons/icons/lights.png",
      silhouette: "/src/assets/progressBar/progressBarIcons/silhouettes/lightsSilhouette.png"
    } as device,

    {
      name:"SmartHomeHub",
      icon:"/src/assets/progressBar/progressBarIcons/icons/hub.png",
      silhouette: "/src/assets/progressBar/progressBarIcons/silhouettes/hubSilhouette.png"
    } as device,

  ]

  const texture = completed ? devices.find(d => d.name === name)?.icon : devices.find(d => d.name === name)?.silhouette;
  return texture ? texture : "";

}