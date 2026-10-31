import { getContactForm, getHomeContent, getTestimonials, getTestimonialsSection } from '@/lib/content/content';
import Hero from '@/components/layout/hero/Hero';
import ContactForm from '@/components/layout/contact/contact-form/ContactForm';
import { LocaleEnum } from '@/types/enums';
import Testimonials from '@/components/layout/testimonials/Testimonials';
import About from '@/components/layout/about/About';
import Booking from '@/components/layout/booking/Booking';
import Faq from '@/components/layout/faq/Faq';
import { HERO_DEFAULTS } from '@/lib/constants/home';
import Gallery from '@/components/layout/gallery/Gallery';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;

  const data = getHomeContent();

  return (
    <main>
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
