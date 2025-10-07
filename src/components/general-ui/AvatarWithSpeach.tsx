import {ProfileAvatar} from "@/components/general-ui/ProfileAvatar.tsx";
import assistantPhone from "@/assets/assistant-phone/assistant_phone_background.png";

type AvatarWithSpeechProps = {
  src: string;
  speech: string;
  buttons?: React.ReactNode
  alt?: string;
};

const AvatarWithSpeech = ({src, speech, buttons, alt = "Profile"}: AvatarWithSpeechProps) => {

  return (
          <div className="fixed top-5 left-20 h-20 w-100 flex items-start space-x-4 z-[101]">
            <img className="fixed top-0 left-0 w-[150px] z-[10]" src={assistantPhone} alt="assistant-phone"/>
            <ProfileAvatar src={src} alt={alt}/>
            <div className="relative bg-gray-100 text-black text-l px-4 py-2 rounded-lg max-w-s font-['Micro_5',monospace] z-[101]">
              {speech}
              {buttons}
              <div className="absolute left-0 top-2 -translate-x-full w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-100"/>
            </div>
          </div>
  );
};

export default AvatarWithSpeech;
