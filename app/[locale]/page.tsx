import { getHomeContent, getGalleryItems, getTestimonials } from '@/lib/content/content';
import Hero from '@/components/layout/hero/Hero';
import GalleryGrid from '@/components/layout/gallery/GalleryGrid';
import ContactForm from '@/components/layout/contact/contact-form/ContactForm';
import { LocaleEnum } from '@/types/enums';
import Testimonials from '@/components/layout/testimonials/Testimonials';
import About from '@/components/layout/about/About';
import { AboutLocale } from '@/types/about';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const LOCALE = locale as LocaleEnum;

  const data = getHomeContent();

  const galleryItems = getGalleryItems().map((item) => ({
    slug: item.slug,
    title: item[`title_${LOCALE}`] || item.title_en || '',
    image: item.image || '',
    category: item.category || [],
  }));

  return (
    <main>
      <Hero
        eyebrow={data[`eyebrow_${LOCALE}`] || 'Tais — Tattoo Artist'}
        headline={data[`headline_${LOCALE}`] || "Ink drawn like it's already under your skin."}
        subheadline={data[`subheadline_${LOCALE}`] || ''}
        ctaLabel={data[`cta_label_${LOCALE}`] || 'Start an inquiry'}
        ctaLink={data.cta_link || '#contact'}
      />
      
      <About locale={locale as AboutLocale} />

      <Testimonials items={getTestimonials()} locale={LOCALE} />

      <section id='gallery' className='wrapper py-24'>
        <GalleryGrid items={galleryItems} />
      </section>

      <section id='contact' className='wrapper max-w-2xl py-24'>
        <ContactForm locale={LOCALE} />
      </section>
    </main>
  );
}
