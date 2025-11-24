import {DeviceNames} from "@/objects/DeviceNames.ts";

export const getPointsWeight: Record<DeviceNames, number> = {
  [DeviceNames.SMART_TV]: 1,
  [DeviceNames.SMART_LIGHTS]:1,
  [DeviceNames.SMART_KITCHEN]: 1,
  [DeviceNames.SMART_HOME_HUB]: 1,
  [DeviceNames.SECURITY_CAMERA]: 1,
  [DeviceNames.SMART_SHOWER]: 1,
  [DeviceNames.SMART_MIRROR]:1
};