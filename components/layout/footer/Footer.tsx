import AnchorLink from '@/components/ui/AnchorLink';
import Eyebrow from '@/components/ui/Eyebrow';
import { FOOTER_LABELS } from '@/lib/constants/footer';
import { NAV_ANCHORS, NAV_LABELS } from '@/lib/constants/shared';
import { getFooter } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

export default function Footer({ locale }: { locale: LocaleEnum }) {
  const footer = getFooter(locale);
  const labels = FOOTER_LABELS[locale];
  const navLabels = NAV_LABELS[locale] ?? NAV_LABELS.en;
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-white/10 py-16'>
      <div className='wrapper grid gap-12 md:grid-cols-3'>
        <div>
          <p className='text-xl uppercase text-white'>{footer.copyrightName}</p>
          {footer.tagline && (
            <p className='mt-4 max-w-xs text-sm leading-relaxed text-white/60'>{footer.tagline}</p>
          )}
          {footer.location && (
            <p className='mt-4 text-xs uppercase tracking-[0.2em] text-white/40'>{footer.location}</p>
          )}
        </div>

        <nav aria-label={labels.sections}>
          <Eyebrow text={labels.sections} className='mb-5' />
          <ul className='space-y-3 text-sm text-white/70'>
            {NAV_ANCHORS.map((key) => (
              <li key={key}>
                <AnchorLink href={`/${locale}#${key}`} className='link-underline'>
                  {navLabels[key]}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        {footer.socials.length > 0 && (
          <div>
            <Eyebrow text={labels.follow} className='mb-5' />
            <ul className='space-y-3 text-sm text-white/70'>
              {footer.socials.map((social) => {
                const external = /^https?:\/\//.test(social.url);
                return (
                  <li key={`${social.platform}-${social.url}`}>
                    <a
                      href={social.url}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className='link-underline'
                    >
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className='wrapper mt-16 border-t border-white/10 pt-6 text-xs text-white/40'>
        © {year} {footer.copyrightName}. {labels.rights}
      </div>
    </footer>
  );
}