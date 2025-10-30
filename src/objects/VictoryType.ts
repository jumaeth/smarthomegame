// typescript
// File: `src/objects/VictorTypeState.ts`
import { PointsLevel } from './PointsLevel';

export class VictoryType {
  private constructor(
          public readonly name: string,
          public readonly privacyScore: PointsLevel,
          public readonly comfortScore: PointsLevel,
          public readonly displayText: string,
          public readonly pictureLink: string
  ) {}

  static readonly PERFECT_BALANCE = new VictoryType(
          'PERFECT_BALANCE',
          PointsLevel.HIGH,
          PointsLevel.HIGH,
          'Perfect Balance: Yippie! You striked the perfect balance. Your Smart Home unlocks smoothly, you ordered your pizza through a secure app, and your friends will arrive soon for a chill night with encrypted Wi-Fi, biometric locks, and good movies. Even your Smart TV compliments you on your data ethics!',
          '/assets/images/perfect-balance.png'
  );

  static readonly PRIVACY_PARADISE = new VictoryType(
          'PRIVACY_PARADISE',
          PointsLevel.LOW,
          PointsLevel.HIGH,
          'The Privacy Paradise: Congrats - your Smart Home does not know any personal information about you. No data is leaking anywhere—but also, nothing works. Your Smart Locks locked down the home tighter than a government black site. Your friends have to enter through the window, the Smart TV is disconnected from all streaming services, and the Pizza delivery service cannot find your house. Nevertheless: you have fun while cooking your home-made pizza from scratch, and spend the evening discussing GDPR case studies by candlelight.',
          '/assets/images/privacy-paradise.png'
  );

  static readonly COMFORT_AND_CHAOS = new VictoryType(
          'COMFORT_AND_CHAOS',
          PointsLevel.HIGH,
          PointsLevel.LOW,
          'Comfort and Chaos: Nice, your Smart Home really works seamlessly! ... But hours later, targeted ads start flooding all of your phones and someone got access to your Smart Camera System, and starts live-streaming the party.',
          '/assets/images/comfort-and-chaos.png'
  );

  static readonly SMART_DUNGEON = new VictoryType(
          'SMART_DUNGEON',
          PointsLevel.LOW,
          PointsLevel.LOW,
          'The Smart Dungeon: Oof - Your Smart Home has gone full rogue! Comfort is non-existent, privacy is compromised— the fridge posts your snack habits online while the thermostat randomly locks at 12°C “for efficiency.”',
          '/assets/images/smart-dungeon.png'
  );

  static readonly CAREFUL_RESIDENCY = new VictoryType(
          'CAREFUL_RESIDENCY',
          PointsLevel.MEDIUM,
          PointsLevel.HIGH,
          'The Careful Smart Residency: You’ve found a safe but slightly awkward spot. Most systems work — the heating adjusts perfectly, lights respond on cue — but every time you speak, your voice assistant insists on anonymizing your request before acting.',
          '/assets/images/careful-residency.png'
  );

  static readonly EASY_LIFE = new VictoryType(
          'EASY_LIFE',
          PointsLevel.HIGH,
          PointsLevel.MEDIUM,
          'The Easy Life: Everything feels smooth — the entrance door glides open once the camera detects your friends, playlists anticipate your mood, and your smart oven preheats before you even think of pizza. Some privacy quirks remain.',
          '/assets/images/easy-life.png'
  );

  static readonly WATCHED_PARTY = new VictoryType(
          'WATCHED_PARTY',
          PointsLevel.MEDIUM,
          PointsLevel.LOW,
          'The Watched Party: You’ve managed to regain partial control — lights, doors, and pizza ordering all function, but everything you do seems to be broadcast somewhere. The Smart Mirror recommends new skincare products based on live footage of your face.',
          '/assets/images/watched-party.png'
  );

  static readonly PRIVACY_FIRST = new VictoryType(
          'PRIVACY_FIRST',
          PointsLevel.LOW,
          PointsLevel.MEDIUM,
          'Privacy First, Comfort Second: You’ve managed to block third-party access to your personal data, but comfort took a hit. The Smart Heater now requires a fingerprint scan every hour, the lights are stuck in “eco mode” dimness.',
          '/assets/images/privacy-first.png'
  );

  static readonly MINDFUL_HOME = new VictoryType(
          'MINDFUL_HOME',
          PointsLevel.MEDIUM,
          PointsLevel.MEDIUM,
          'The Mindful Home: You’ve found a comfortable middle ground — your Smart Home mostly behaves, and your data stays fairly private. The lights adjust after you accept on the Smart App, and the Smart TV only tracks which movies you\'ve watched.',
          '/assets/images/mindful-home.png'
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

  static fromLevels(privacy: PointsLevel | undefined, comfort: PointsLevel| undefined): VictoryType | undefined {
    return VictoryType.values().find(
            v => v.privacyScore === privacy && v.comfortScore === comfort
    );
  }

  toString(): string {
    return `${this.name}: ${this.displayText}`;
  }
}