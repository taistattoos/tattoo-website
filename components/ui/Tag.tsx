interface TagPropsInterface {
    text: string;
    className?: string;
}

export default function Tag({text, className}:TagPropsInterface) {
  return (
    <span className={`${className}`}>
      {text}
    </span>
  )
}
