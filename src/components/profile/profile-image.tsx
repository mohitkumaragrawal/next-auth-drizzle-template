interface ProfileImageProps {
  imageUrl?: string;
}

export default function ProfileImage({ imageUrl }: ProfileImageProps) {
  return (
    // TODO: Add a fallback profile image
    <img
      src={imageUrl ?? ""}
      alt="profile imge"
      className="min-w-10 min-h-10 w-10 h-10 rounded-full overflow-hidden"
      referrerPolicy="no-referrer"
    />
  );
}
