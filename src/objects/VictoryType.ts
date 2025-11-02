// typescript
// File: `src/objects/VictoryType.ts`
import { PointsLevel } from './PointsLevel';

import result_p_low_c_low from '@/assets/victory-page/result_p_low_c_low.png';
import result_p_low_c_mid from '@/assets/victory-page/result_p_low_c_mid.png';
import result_p_low_c_high from '@/assets/victory-page/result_p_low_c_high.png';
import result_p_mid_c_low from '@/assets/victory-page/result_p_mid_c_low.png';
import result_p_mid_c_mid from '@/assets/victory-page/result_p_mid_c_mid.png';
import result_p_mid_c_high from '@/assets/victory-page/result_p_mid_c_high.png';
import result_p_high_c_low from '@/assets/victory-page/result_p_high_c_low.png';
import result_p_high_c_mid from '@/assets/victory-page/result_p_high_c_mid.png';
import result_p_high_c_high from '@/assets/victory-page/result_p_high_c_high.png';

export class VictoryType {
  private constructor(
          public readonly name: string,
          public readonly privacyScore: PointsLevel,
          public readonly comfortScore: PointsLevel,
          public readonly displayText: string,
          public readonly picture: string
  ) {}

  static readonly PERFECT_BALANCE = new VictoryType(
          'PERFECT_BALANCE',
          PointsLevel.HIGH,
          PointsLevel.HIGH,
          'Perfect Balance: Yippie! You striked the perfect balance. Your Smart Home unlocks smoothly, you ordered your pizza through a secure app, and your friends will arrive soon for a chill night with encrypted Wi-Fi, biometric locks, and good movies. Even your Smart TV compliments you on your data ethics!',
          result_p_high_c_high
  );

  static readonly PRIVACY_PARADISE = new VictoryType(
          'PRIVACY_PARADISE',
          PointsLevel.HIGH,
          PointsLevel.LOW,
          'The Privacy Paradise: Congrats - your Smart Home does not know any personal information about you. No data is leaking anywhere—but also, nothing works. Your Smart Locks locked down the home tighter than a government black site. Your friends have to enter through the window, the Smart TV is disconnected from all streaming services, and the Pizza delivery service cannot find your house. Nevertheless: you have fun while cooking your home-made pizza from scratch, and spend the evening discussing GDPR case studies by candlelight.',
          result_p_high_c_low
  );

  static readonly COMFORT_AND_CHAOS = new VictoryType(
          'COMFORT_AND_CHAOS',
          PointsLevel.LOW,
          PointsLevel.HIGH,
          'Comfort and Chaos: Nice, your Smart Home really works seamlessly! ... But hours later, targeted ads start flooding all of your phones and someone got access to your Smart Camera System, and starts live-streaming the party.',
          result_p_low_c_high
  );

  static readonly SMART_DUNGEON = new VictoryType(
          'SMART_DUNGEON',
          PointsLevel.LOW,
          PointsLevel.LOW,
          'The Smart Dungeon: Oof - Your Smart Home has gone full rogue! Comfort is non-existent, privacy is compromised— the fridge posts your snack habits online while the thermostat randomly locks at 12°C “for efficiency.”',
          result_p_low_c_low
  );

  static readonly CAREFUL_RESIDENCY = new VictoryType(
          'CAREFUL_RESIDENCY',
          PointsLevel.HIGH,
          PointsLevel.MEDIUM,
          'The Careful Smart Residency: You’ve found a safe but slightly awkward spot. Most systems work — the heating adjusts perfectly, lights respond on cue — but every time you speak, your voice assistant insists on anonymizing your request before acting.',
          result_p_high_c_mid
  );

  static readonly EASY_LIFE = new VictoryType(
          'EASY_LIFE',
          PointsLevel.MEDIUM,
          PointsLevel.HIGH,
          'The Easy Life: Everything feels smooth — the entrance door glides open once the camera detects your friends, playlists anticipate your mood, and your smart oven preheats before you even think of pizza. Some privacy quirks remain.',
          result_p_mid_c_high
  );

  static readonly WATCHED_PARTY = new VictoryType(
          'WATCHED_PARTY',
          PointsLevel.LOW,
          PointsLevel.MEDIUM,
          'The Watched Party: You’ve managed to regain partial control — lights, doors, and pizza ordering all function, but everything you do seems to be broadcast somewhere. The Smart Mirror recommends new skincare products based on live footage of your face.',
          result_p_low_c_mid
  );

  static readonly PRIVACY_FIRST = new VictoryType(
          'PRIVACY_FIRST',
          PointsLevel.MEDIUM,
          PointsLevel.LOW,
          'Privacy First, Comfort Second: You’ve managed to block third-party access to your personal data, but comfort took a hit. The Smart Heater now requires a fingerprint scan every hour, the lights are stuck in “eco mode” dimness.',
          result_p_mid_c_low
  );

  static readonly MINDFUL_HOME = new VictoryType(
          'MINDFUL_HOME',
          PointsLevel.MEDIUM,
          PointsLevel.MEDIUM,
          'The Mindful Home: You’ve found a comfortable middle ground — your Smart Home mostly behaves, and your data stays fairly private. The lights adjust after you accept on the Smart App, and the Smart TV only tracks which movies you\'ve watched.',
          result_p_mid_c_mid
  );

  static values(): VictoryType[] {
    return [
      VictoryType.PERFECT_BALANCE,
      VictoryType.PRIVACY_PARADISE,
      VictoryType.COMFORT_AND_CHAOS,
      VictoryType.SMART_DUNGEON,
      VictoryType.CAREFUL_RESIDENCY,
      VictoryType.EASY_LIFE,
      VictoryType.WATCHED_PARTY,
      VictoryType.PRIVACY_FIRST,
      VictoryType.MINDFUL_HOME
    ];
  }

  static fromLevels(privacy: PointsLevel | undefined, comfort: PointsLevel | undefined): VictoryType | undefined {
    return VictoryType.values().find(v => v.privacyScore === privacy && v.comfortScore === comfort);
  }

  toString(): string {
    return `${this.name}: ${this.displayText}`;
  }
}