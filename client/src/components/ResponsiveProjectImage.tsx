type ResponsiveProjectImageProps = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
};

export default function ResponsiveProjectImage({
  src,
  alt,
  wrapperClassName = "",
  imageClassName = "",
  loading = "lazy",
}: ResponsiveProjectImageProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-slate-100 aspect-[16/9] ${wrapperClassName}`.trim()}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={`h-full w-full object-cover object-center ${imageClassName}`.trim()}
      />
    </div>
  );
}