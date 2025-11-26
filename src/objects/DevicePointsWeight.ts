import {DeviceNames} from "@/objects/DeviceNames";

export const getPointsWeight: Record<DeviceNames, number> = {
  [DeviceNames.SMART_TV]: 1.5,
  [DeviceNames.SMART_LIGHTS]:1,
  [DeviceNames.SMART_KITCHEN]: 1,
  [DeviceNames.SMART_HOME_HUB]: 1.25,
  [DeviceNames.SECURITY_CAMERA]: 1.5,
  [DeviceNames.SMART_SHOWER]: 1.25,
  [DeviceNames.SMART_MIRROR]:1.5
};