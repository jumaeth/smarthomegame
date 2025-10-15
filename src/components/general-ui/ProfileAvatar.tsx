type ProfileAvatarProps = {
  src: string;
  alt?: string;
  size?: number;
};

export const ProfileAvatar = ({src, alt = "Profile Avatar", size = 64}: ProfileAvatarProps) => {
  const dimension = `${size}px`;
  return (
          <img
                  src={src}
                  alt={alt}
                  className="rounded-full object-cover border-2 border-gray-300 bg-black z-[11]"
                  style={{width: dimension, height: dimension}}
          />
  );
};
