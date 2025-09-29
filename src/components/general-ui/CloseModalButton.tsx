type ButtonCloseModalProps = {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
};

const CloseModalButton = ({onClick, ariaLabel, children}: ButtonCloseModalProps) => {
  const baseStyles = "absolute top-[15px] right-[15px] w-[30px] h-[30px] p-0 pb-[6px] flex items-center justify-center bg-black border-none cursor-pointer text-white text-[42px] leading-[1]";

  return (
          <button
                  onClick={onClick}
                  aria-label={ariaLabel}
                  className={`${baseStyles}`}
          >
            {children}
          </button>
  );
};

export default CloseModalButton;
