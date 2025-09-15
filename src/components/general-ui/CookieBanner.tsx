import Button from "@/components/general-ui/Button.tsx";
import Toggle from "@/components/general-ui/Toggle.tsx";
import {useState} from "react";
import gifCookie from "@/assets/intro/page/cookie-gif-2.gif";

type CookieBannerProps = {
    onComplete: (isAccepted: boolean) => void;
};

export const CookieBanner = ({
                                 onComplete,
                             }: CookieBannerProps) => {
    const BannerText = () => (
        <>
            <p>
                Wir verwenden <strong>[specify here]</strong> Cookies, um Ihnen den späteren Zugriff auf unser Webgame zu
                ermöglichen und die Nutzererfahrung zu verbessern. Cookies sind kleine Dateien, die auf Ihrem Gerät
                gespeichert werden.
            </p>
            <p>
                Durch die Nutzung unserer Webseite stimmen Sie der Verwendung von Cookies gemäß unserer{' '}
                <a href="/datenschutz" className="underline text-blue-600 hover:text-blue-800">
                    Datenschutzerklärung [insert link to data protection policy, which I am in the process of writing]
                </a>{' '}
                zu.
            </p>
        </>
    );

    const submitAnswer: (selection: boolean) => void = (selection: boolean): void => {
        onComplete(selection);
    };

    const [isSavegameEnabled, setIsSavegameEnabled] = useState<boolean>(true);

    const accept: () => void = (): void => {
        submitAnswer(true)
        setIsSavegameEnabled(true);
    };
    const decline: () => void = (): void => {
        submitAnswer(false)
        setIsSavegameEnabled(false);
    };

    return (
        <div className="text-gray-700">
            <div className="inline-flex items-center whitespace-nowrap">
                <h1 className="text-black font-bold text-3xl">Cookie Banner</h1>
                <img
                    src={gifCookie}
                    alt="Cookie"
                    className="w-20 h-20 ml-2 flex-shrink-0"
                />

            </div>
            <div className={"w-[max(30rem,30vw)]"}><BannerText/></div>
            <h2 className={'bold text-2xl'}> Ihre Einwilligung:</h2>
            <div className={"flex items-center"}>
                <Toggle isOn={isSavegameEnabled} disabled={true} offColor={"bg-red-400"}/><p>Mein Spielfortschritt
                speichern</p>
            </div>
            <p className={"w-[max(30rem,30vw)]"}>Sie können Ihre Einwilligung jederzeit widerrufen oder Ihre
                Cookie-Einstellungen anpassen. Weitere Informationen finden Sie in unserer Datenschutzerklärung.</p>
            <Button children={"Akzeptieren"} onClick={accept} className={"m-2"}/>
            <Button children={"Einstellungen anpassen / Ablehnen"} onClick={decline} className={"m-2"}/>
        </div>
    );
};

