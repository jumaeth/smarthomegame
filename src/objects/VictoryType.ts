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
import { t } from "@lingui/core/macro";

export class VictoryType {
        private constructor(
                public readonly name: string,
                public readonly privacyScore: PointsLevel,
                public readonly comfortScore: PointsLevel,
                // deferred translation: Funktion statt fertigem String
                public readonly displayText: () => string,
                public readonly picture: string
        ) { }

        static readonly PERFECT_BALANCE = new VictoryType(
                'PERFECT_BALANCE',
                PointsLevel.HIGH,
                PointsLevel.HIGH,
                () => t`Perfect Balance: Yippie! You struck the perfect balance. Your Smart Home unlocks smoothly, you ordered your pizza through a secure app, and your friends will arrive soon for a chill night with encrypted Wi-Fi, biometric locks, and good movies. Even your smart TV compliments you on your data ethics.`,
                result_p_high_c_high
        );

        static readonly PRIVACY_PARADISE = new VictoryType(
                'PRIVACY_PARADISE',
                PointsLevel.HIGH,
                PointsLevel.LOW,
                () => t`The Privacy Paradise: Congrats — your smart home does not know any personal information about you. No data is leaking anywhere — but also, nothing actually works. Your smart locks have shut the home down tighter than a government black site. Your friends have to climb in through the window, the smart TV is disconnected from all streaming services, and the pizza delivery service cannot find your house. Nevertheless, you have fun making your homemade pizza from scratch and spend the evening discussing GDPR case studies by candlelight. Maybe it’s time to reconsider whether a smart home is really for you — you barely use any of its features.`,
                result_p_high_c_low
        );

        static readonly COMFORT_AND_CHAOS = new VictoryType(
                'COMFORT_AND_CHAOS',
                PointsLevel.LOW,
                PointsLevel.HIGH,
                () => t`Comfort and Chaos: Nice, your Smart Home really works seamlessly! ... But hours later, targeted ads start flooding all of your phones and someone got access to your Smart Camera System and is now live-streaming the party.`,
                result_p_low_c_high
        );

        static readonly SMART_DUNGEON = new VictoryType(
                'SMART_DUNGEON',
                PointsLevel.LOW,
                PointsLevel.LOW,
                () => t`The Smart Dungeon: Oof — your smart home has gone fully rogue! Your doors are still tightly locked, and privacy is compromised. The fridge shares your snack habits online while the thermostat randomly locks at 12°C “for efficiency.” Your friends cannot find your smart home because your messenger service blocks location data, while the pizza delivery bot forwards your coordinates to ad agencies. You unplug the main power and spend the night with a candle and your favorite book. Maybe try to prioritize robust privacy settings next time and consider the permissions your smart home needs to function.`,
                result_p_low_c_low
        );

        static readonly CAREFUL_RESIDENCY = new VictoryType(
                'CAREFUL_RESIDENCY',
                PointsLevel.HIGH,
                PointsLevel.MEDIUM,
                () => t`The Careful Smart Residency: You’ve found a safe but slightly awkward spot. Most systems work — the heating adjusts perfectly, the lights respond on cue — but every time you speak, your voice assistant insists on anonymizing your request before acting. There’s a slight delay before the pizza order goes through (via a triple VPN), but it eventually works. Your friends arrive to find you proudly explaining your homemade firewall over pizza, and you all browse the smart TV together in search of the perfect movie.`,
                result_p_high_c_mid
        );

        static readonly EASY_LIFE = new VictoryType(
                'EASY_LIFE',
                PointsLevel.MEDIUM,
                PointsLevel.HIGH,
                () => t`The Easy Life: Everything feels smooth — the entrance door glides open once the camera detects your friends, playlists anticipate your mood, and your smart oven preheats before you even think of pizza. However, since your group discussed squid on pizza, the smart TV now only suggests movies about octopuses, and your social media feed is flooded with videos about sea animals. You shrug, because at least the lighting is perfect for movie night.`,
                result_p_mid_c_high
        );

        static readonly WATCHED_PARTY = new VictoryType(
                'WATCHED_PARTY',
                PointsLevel.LOW,
                PointsLevel.MEDIUM,
                () => t`The Watched Party: You’ve managed to regain partial control — lights, doors, and pizza ordering all function, but everything you do seems to be shared somewhere. Your smart mirror recommends new skincare products based on live footage of your face, and your conversations suddenly become the theme of all your Smart TV ads: new video games, special discounts on instant soups, or painkillers — perfectly timed for your friend’s recent wisdom-tooth removal, which had just been the topic. The pizza is hot and tasty, but you spend a lot of time scrolling through endless smart movie recommendations and ads. You might want to minimize the amount of data you share next time.`,
                result_p_low_c_mid
        );

        static readonly PRIVACY_FIRST = new VictoryType(
                'PRIVACY_FIRST',
                PointsLevel.MEDIUM,
                PointsLevel.LOW,
                () => t`Privacy First, Comfort Second: You’ve managed to block third-party access to your personal data, but comfort has taken a hit. The smart heater now requires a fingerprint scan every hour, the lights are stuck in “eco mode” dimness, and the oven refuses to preheat via the app — it seems you have to handle all the “smart” tasks yourself. At least your friends offered to bring pizza after you couldn’t store your location in the delivery app, and you open the door for them manually once they knock. Your privacy preferences are at a good level, but your Smart Home lacks the data access it needs to function properly. Next time, try to consider the consequences of specific data-access permissions for your Smart Home.`,
                result_p_mid_c_low
        );

        static readonly MINDFUL_HOME = new VictoryType(
                'MINDFUL_HOME',
                PointsLevel.MEDIUM,
                PointsLevel.MEDIUM,
                () => t`The Mindful Home: You’ve found a comfortable middle ground — your smart home mostly behaves, and your data stays fairly private. The lights adjust after you approve the change in the app, and the smart TV only tracks which movies you’ve watched but not your viewing patterns. When your friends arrive, the door unlocks after you manually approve their entry, and your smart speaker politely asks before playing music. Even though your home could be functioning more intelligently, your pizza has arrived, the smart TV is ready, and your friends are all excited to watch a movie.`,
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
                // displayText() wird erst beim Aufruf ausgeführt — i18n muss vorher aktiviert sein
                return `${this.name}: ${this.displayText()}`;
        }
}