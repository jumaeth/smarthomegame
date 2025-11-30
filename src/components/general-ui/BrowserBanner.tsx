import { Trans } from "@lingui/react/macro";
import Button from "@/components/general-ui/Button.tsx";

type BrowserBannerProps = {
  onComplete: (isAccepted: boolean) => void;
};

export default function BrowserBanner({ onComplete }: BrowserBannerProps) {

  const BannerText = () => (
    <>
      <p className="text-2xl pb-4">
        <Trans>
          For the best experience, please use Chrome or Safari.
        </Trans>
      </p>
      <p>
        <Trans>Our game is optimized for these browsers. If you’'re using another browser, some features may not work
          correctly. Make sure your Browser is up-to-date.</Trans>
      </p>
    </>
  );

  const onAccept: (selection: boolean) => void = (selection: boolean): void => {
    onComplete(selection);
  };

  return (
    <div className="text-gray-700 flex flex-col gap-4">
      <div className="inline-flex items-center whitespace-nowrap">
        <h1 className="text-black font-bold text-3xl"><Trans>Browser choice</Trans></h1>
      </div>
      <div className={"w-full"}><BannerText /></div>
      <Button onClick={() => onAccept(true)} className={"m-2"}><Trans>accept</Trans></Button>
    </div>
  )
}