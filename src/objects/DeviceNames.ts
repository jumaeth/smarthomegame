import {t} from "@lingui/core/macro";

export enum DeviceNames {
  SMART_TV = "SmartTv",
  SMART_LIGHTS = "SmartLights",
  SMART_KITCHEN = "SmartKitchen",
  SMART_HOME_HUB = "SmartHomeHub",
  SECURITY_CAMERA = "SecurityCamera",
  SMART_SHOWER = "SmartShower",
  SMART_MIRROR = "SmartMirror"
}

export function deviceNameToEnum(roomName: string): DeviceNames | undefined {
  for (const key in DeviceNames) {
    if (DeviceNames[key as keyof typeof DeviceNames].toLowerCase() === roomName.toLowerCase()) {
      return DeviceNames[key as keyof typeof DeviceNames];
    }
  }
  return undefined;
}

export const deviceDisplayName: Record<DeviceNames, () => string> = {
  [DeviceNames.SMART_TV]: () => t`Smart TV`,
  [DeviceNames.SMART_LIGHTS]: () => t`Smart Lights`,
  [DeviceNames.SMART_KITCHEN]: () => t`Smart Kitchen`,
  [DeviceNames.SMART_HOME_HUB]: () => t`Smart Home Hub`,
  [DeviceNames.SECURITY_CAMERA]: () => t`Security Camera`,
  [DeviceNames.SMART_SHOWER]: () => t`Smart Shower`,
  [DeviceNames.SMART_MIRROR]: () => t`Smart Mirror`
};