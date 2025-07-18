import Button from "@/components/general-ui/Button.tsx";

type CookieBannerProps = {
  onComplete: (isAccepted: boolean) => void;
};

export const CookieBanner = ({
                               onComplete,
                             }: CookieBannerProps) => {
  const BannerText: string = "Do you want to sell your soul and accept all cookies?"

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
            <p> {BannerText} </p>
            <Button children={"yes"} onClick={accept} className={"m-2"}/>
            <Button children={"no"} onClick={decline} className={"m-2"}/>
          </div>
  );
};