import Button from "@/components/general-ui/Button.tsx";
import {useState} from "react";
import gifCookie from "@/assets/intro/page/cookie-gif-2.gif";
import {Trans} from "@lingui/react/macro";

type CookieBannerProps = {
  onComplete: (isAccepted: boolean) => void;
};

export const CookieBanner = ({
                               onComplete,
                             }: CookieBannerProps) => {
  const BannerText = () => (
          <>
            <p><Trans>
              We use functional cookies to enable your later access to our web game and to improve the user experience.
              Cookies are small files stored on your device.
            </Trans></p>
            <p>
              <Trans>by using our website, you agree to the use of cookies in accordance with our </Trans>
              <a href="https://www.datapro.education/" className="underline text-blue-600 hover:text-blue-800">
                <Trans>privacy policy</Trans>
              </a>
              .
            </p>
          </>
  );

  const submitAnswer: (selection: boolean) => void = (selection: boolean): void => {
    onComplete(selection);
  };

  const [, setIsSavegameEnabled] = useState<boolean>(true);

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
              <h1 className="text-black font-bold text-3xl"><Trans>Cookie banner</Trans></h1>
              <img
                      src={gifCookie}
                      alt="Cookie"
                      className="w-20 h-20 ml-2 flex-shrink-0"
              />
            </div>
            <div className={"w-[max(30rem,30vw)]"}><BannerText/></div>
            <p className={"w-[max(30rem,30vw)]"}><Trans>You can withdraw your consent at any time or adjust your cookie
              settings. Further information can be found in our privacy policy.</Trans></p>
            <Button onClick={accept} className={"m-2"}><Trans>accept</Trans></Button>
            <Button onClick={decline} className={"m-2"}><Trans>decline</Trans></Button>
          </div>
  );
};

