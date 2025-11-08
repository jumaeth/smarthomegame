type ButtonCloseModalProps = {
  onClick: () => void;
  ariaLabel: string;
};

const CloseModalButton = ({onClick, ariaLabel}: ButtonCloseModalProps) => {
  const baseStyles = "absolute top-[15px] right-[15px] w-[40px] h-[40px] flex items-center justify-center bg-black cursor-pointer rounded-sm";

  return (
          <button
                  onClick={onClick}
                  aria-label={ariaLabel}
                  className={`${baseStyles}`}
          >
            <div className="text-white text-[40px] translate-y-[-4px]">x</div>
          </button>
  );
};

export default CloseModalButton;
