import type { Metadata } from 'next';
import { getContactForm, getFooter, getHomeContent, getTestimonials, getTestimonialsSection } from '@/lib/content/content';
import { AREA_SERVED, HOME_META } from '@/lib/constants/seo';
import { OG_IMAGE, pageMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import Hero from '@/components/layout/hero/Hero';
import ContactForm from '@/components/layout/contact/contact-form/ContactForm';
import { LocaleEnum } from '@/types/enums';
import Testimonials from '@/components/layout/testimonials/Testimonials';
import About from '@/components/layout/about/About';
import Booking from '@/components/layout/booking/Booking';
import Faq from '@/components/layout/faq/Faq';
import { HERO_DEFAULTS } from '@/lib/constants/home';
import Gallery from '@/components/layout/gallery/Gallery';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = HOME_META[locale as LocaleEnum] ?? HOME_META.en;

  return pageMetadata({ locale, title: meta.title, description: meta.description, absoluteTitle: true });
}

// Structured data so Google understands this is a tattoo artist serving these cities.
function businessJsonLd(locale: LocaleEnum) {
  const meta = HOME_META[locale] ?? HOME_META.en;

  return {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    image: `${SITE_URL}${OG_IMAGE.url}`,
    description: meta.description,
    areaServed: AREA_SERVED.map((name) => ({ '@type': 'City', name })),
    sameAs: getFooter(locale)
      .socials.map((social) => social.url)
      .filter((url) => /^https?:\/\//.test(url)),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;

  const data = getHomeContent();

  return (
    <main>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd(LOCALE)).replace(/</g, '\\u003c') }}
      />

      <Hero
        eyebrow={data[`eyebrow_${LOCALE}`] || 'Tais — Tattoo Artist'}
        headline={data[`headline_${LOCALE}`] || "Ink drawn like it's already under your skin."}
        subheadline={data[`subheadline_${LOCALE}`] || ''}
        ctaLabel={data[`cta_label_${LOCALE}`] || 'Start an inquiry'}
        ctaLink={data.cta_link || '#contact'}
        videoSrc={data.hero_video || HERO_DEFAULTS.videoSrc}
        posterSrc={data.hero_poster || undefined}
        overlay={data.hero_overlay ?? HERO_DEFAULTS.overlay}
        grayscale={data.hero_grayscale ?? HERO_DEFAULTS.grayscale}
      />

      <Gallery locale={LOCALE} />

      <About locale={LOCALE} />

      <Testimonials heading={getTestimonialsSection(LOCALE).title} items={getTestimonials(LOCALE)} locale={LOCALE} />

      <Booking locale={LOCALE} />

      <Faq locale={LOCALE} />

      <section id='contact' className='wrapper py-24'>
        <ContactForm content={getContactForm(LOCALE)} />
      </section>
    </main>
  );
}
