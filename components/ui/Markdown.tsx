import Image from 'next/image';
import ReactMarkdown, { type Components } from 'react-markdown';

const components: Components = {
  h2: ({ children }) => (
    <h2 className='mb-4 mt-10 text-3xl leading-tight text-white first:mt-0'>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className='mb-3 mt-8 text-xl leading-snug text-white first:mt-0'>{children}</h3>
  ),
  p: ({ children }) => <p className='mb-5 text-base leading-relaxed text-white/70'>{children}</p>,
  strong: ({ children }) => <strong className='font-semibold text-white'>{children}</strong>,
  em: ({ children }) => <em className='italic'>{children}</em>,
  a: ({ href, children }) => {
    const external = !!href && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className='text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white'
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className='mb-5 list-disc space-y-2 pl-6 text-white/70 marker:text-white/30'>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className='mb-5 list-decimal space-y-2 pl-6 text-white/70 marker:text-white/30'>{children}</ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className='my-8 border-l border-white/20 pl-5 italic text-white/60'>{children}</blockquote>
  ),
  hr: () => <hr className='my-10 border-white/10' />,
  img: ({ src, alt }) => {
    if (typeof src !== 'string' || src === '') return null;
    if (src.startsWith('/')) {
      return (
        <Image
          src={src}
          alt={alt ?? ''}
          width={1200}
          height={800}
          sizes='(max-width: 768px) 100vw, 50vw'
          className='my-8 h-auto w-full'
        />
      );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ''} loading='lazy' className='my-8 h-auto w-full' />;
  },
};

export default function Markdown({ children }: { children: string }) {
  return (
    <div className='[&>*:last-child]:mb-0'>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  );
}