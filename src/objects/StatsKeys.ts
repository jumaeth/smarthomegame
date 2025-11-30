import { t } from "@lingui/core/macro";

export enum StatsKeys {
  TIME_IN_DEVICE,
  AMOUNT_OF_DEVICE_SESSIONS
}

export const statisticsDisplayName: Record<StatsKeys, () => string> = {
  [StatsKeys.TIME_IN_DEVICE]: () => t`Time spent on device (s)`,
  [StatsKeys.AMOUNT_OF_DEVICE_SESSIONS]: () => t`Device open count`
}