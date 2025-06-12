import React from "react";

type ButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({onClick, disabled, children}) => {
  const baseStyles = "px-4 py-2 transition-colors duration-200 text-white text-[18px]";
  const enabledStyles = "bg-[#2222aa] rounded-[8px] cursor-pointer hover:cursor-pointer";
  const disabledStyles = "bg-gray-300 rounded-[8px] text-gray-600 cursor-not-allowed";

  return (
          <button
                  onClick={onClick}
                  disabled={disabled}
                  className={`${baseStyles} ${disabled ? disabledStyles : enabledStyles}`}
          >
            {children}
          </button>
  );
};

export default Button;