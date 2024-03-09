interface ProfileImageProps {
  imageUrl?: string;
}

export default function ProfileImage({ imageUrl }: ProfileImageProps) {
  return (
    // TODO: Add a fallback profile image
    <img
      src={imageUrl ?? ""}
      alt="profile imge"
      className="h-10 min-h-10 w-10 min-w-10 overflow-hidden rounded-full"
      referrerPolicy="no-referrer"
    />
  );
}
