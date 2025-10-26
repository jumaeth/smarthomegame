import {t} from "@lingui/core/macro";
import assistantPhone from "@/assets/assistant-phone/assistant_phone_background.png";
import {useState} from "react";
import AvatarWithSpeach from "@/components/general-ui/AvatarWithSpeach.tsx";
import Avatar from "@/assets/tutorial/explanationPages/pointLeft.png";
import {SmartDevice} from "@/objects/SmartDevice.ts";
import Button from "@/components/general-ui/Button.tsx";
import {Trans} from "@lingui/react/macro";

type HelpButtonProps = {
  newMessage: boolean;
  smartDevice: SmartDevice;
};

const HelpButton = ({newMessage, smartDevice}: HelpButtonProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("Wow, interesting task you got there, do you need help with anything?")

  const onYes: () => void = (): void => {
    setMessage(smartDevice ? smartDevice.getHelpText() : t`This is more difficult than i thought, unfortunately I cannot support you with this.`)
    setButtons(<div>{close}</div>)
  }

  const onNo: () => void = (): void => {
    setShowMessage(false)
  }

  const openMessage: () => void = (): void => {
    setShowMessage(true);
    setMessage("Wow, interesting task you got there, do you need help with anything?")
    setButtons(<div>{yes}{no}</div>)
  }

  const closeMessage: () => void = (): void => {
    setShowMessage(false);
    setWasRead(true);
  }

  const yes = <Button onClick={onYes}><Trans>Yes</Trans></Button>;
  const no = <Button onClick={onNo}><Trans>No</Trans></Button>;
  const close = <Button onClick={closeMessage}><Trans>Close</Trans></Button>;
  const [wasRead, setWasRead] = useState(!newMessage);

  const [buttons, setButtons] = useState(<div>{yes}{no}</div>)
  console.log(newMessage)

  return (
          <div className="fixed top-5 left-20 h-20 w-100 flex items-start space-x-4 z-[101]">
            <img className="fixed top-0 left-0 w-[150px] z-[10]" src={assistantPhone} alt="assistant-phone"
                 onClick={openMessage}/>
            { !wasRead && (
                    <b className="z-11 fixed top-16 left-18 h-7 w-7 rounded-full bg-red-600 border-black border-2 text-center align-middle"
                       onClick={openMessage}>1</b>
            )}
            {showMessage && (
                    <AvatarWithSpeach
                            src={Avatar}
                            speech={message}
                            buttons={buttons}
                    />
            )}
          </div>
  );
};

export default HelpButton;
