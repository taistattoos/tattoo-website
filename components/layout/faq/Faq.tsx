import SplitText from '@/components/animations/SplitText';
import Accordion from '@/components/ui/Accordion';
import Markdown from '@/components/ui/Markdown';
import { getFaq } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

export default function Faq({ locale }: { locale: LocaleEnum }) {
  const faq = getFaq(locale);

  if (faq.items.length === 0) return null;

  const items = faq.items.map((item, index) => ({
    id: `faq-${index}`,
    title: item.question,
    content: <Markdown>{item.answer}</Markdown>,
  }));

  return (
    <section id='faq' aria-labelledby='faq-title' className='py-24'>
      <div className='wrapper'>
        <SplitText
          as='h2'
          id='faq-title'
          text={faq.title}
          by='words'
          stagger={0.08}
          className='mb-12 block text-4xl leading-tight text-white md:text-5xl'
        />

        <Accordion items={items} />
      </div>
    </section>
  );
}