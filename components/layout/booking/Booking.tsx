import SplitText from '@/components/animations/SplitText';
import BookingSteps from '@/components/layout/booking/BookingSteps';
import { getBooking } from '@/lib/content/content';
import { LocaleEnum } from '@/types/enums';

export default function Booking({ locale }: { locale: LocaleEnum }) {
  const booking = getBooking(locale);

  if (booking.steps.length === 0) return null;

  return (
    <section id='booking' aria-labelledby='booking-title' className='py-24'>
      <div className='wrapper'>
        <SplitText
          as='h2'
          id='booking-title'
          text={booking.title}
          by='words'
          stagger={0.08}
          className='mb-16 block text-4xl leading-tight text-white md:text-5xl'
        />

        <BookingSteps steps={booking.steps} />
      </div>
    </section>
  );
}
