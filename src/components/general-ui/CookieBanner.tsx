import Button from "@/components/general-ui/Button.tsx";

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
            <p>
              <strong>Ihre Einwilligung:</strong> Sie können Ihre Einwilligung jederzeit widerrufen oder Ihre
              Cookie-Einstellungen anpassen. Weitere Informationen finden Sie in unserer Datenschutzerklärung.
            </p>
          </>
  );

  const submitAnswer: (selection: boolean) => void = (selection: boolean): void => {
    onComplete(selection);
  };

  const accept: () => void = (): void => {
    submitAnswer(true)
  };
  const decline: () => void = (): void => {
    submitAnswer(false)
  };

  return (
          <div>
            <h1> Cookie Banner </h1>
            <div className={"w-[max(30rem,30vw)]"}><BannerText/></div>
            <Button children={"Akzeptieren"} onClick={accept} className={"m-2"}/>
            <Button children={"Einstellungen anpassen / Ablehnen"} onClick={decline} className={"m-2"}/>
          </div>
  );
};