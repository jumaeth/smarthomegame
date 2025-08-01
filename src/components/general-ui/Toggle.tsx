import { useState } from "react";

interface ToggleProps {
  isOn?: boolean;
  onToggle?: (isOn: boolean) => void;
  defaultChecked?: boolean;
  disabled?: boolean;
  onColor?: string;
  offColor?: string;
}

const Toggle: React.FC<ToggleProps> = ({
                                         isOn: controlledIsOn,
                                         onToggle,
                                         defaultChecked = false,
                                         disabled = false,
                                         onColor = "bg-blue-500",
                                         offColor = "bg-gray-300"
                                       }) => {
  const [internalIsOn, setInternalIsOn] = useState<boolean>(defaultChecked);

  // Use controlled state if provided, otherwise use internal state
  const isOn = controlledIsOn !== undefined ? controlledIsOn : internalIsOn;

  const handleToggle = (): void => {
    if (disabled) return;

    if (onToggle) {
      onToggle(!isOn);
    } else {
      setInternalIsOn(!internalIsOn);
    }
  };

  return (
          <button
                  onClick={handleToggle}
                  disabled={disabled}
                  className={`
        w-12 h-7 my-1 mx-4
        ${isOn ? onColor : offColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}
        rounded-full relative inline-flex items-center justify-start
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
          >
      <span
              className={`
          w-5 h-5
          ${isOn ? 'translate-x-5' : 'translate-x-1'}
          bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
        `}
      />
          </button>
  );
};

export default Toggle;