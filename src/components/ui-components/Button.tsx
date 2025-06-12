type ButtonProps = {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children, className }) => {
  const baseStyles = "px-4 py-2 transition-colors duration-200 text-white text-[18px]";
  const enabledStyles = "bg-[#2222aa] rounded-[8px] cursor-pointer hover:cursor-pointer";
  const disabledStyles = "bg-gray-300 rounded-[8px] text-gray-600 cursor-not-allowed";

  return (
          <button
                  onClick={onClick}
                  disabled={disabled}
                  className={`${baseStyles} ${disabled ? disabledStyles : enabledStyles} ${className ?? ""}`}
          >
            {children}
          </button>
  );
};

export default Button;
