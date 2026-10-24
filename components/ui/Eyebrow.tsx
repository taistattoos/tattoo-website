interface EyebrowPropsInterface {
    text: string;
    className?: string;
}

export default function Eyebrow({text, className}:EyebrowPropsInterface) {
  return (
    <span className={`${className} block text-xs uppercase tracking-[0.25em] text-white/50`}>
      {text}
    </span>
  )
}
