import { LocaleEnum } from '@/types/enums';

/** Everything that can go wrong when sending a form. 'generic' falls back to the CMS error text. */
export type FormErrorCode = 'rate' | 'captcha' | 'invalid' | 'unavailable' | 'timeout' | 'turnstile' | 'generic';

// Give up waiting for the server after this long (Turnstile check + email sending).
export const FORM_TIMEOUT_MS = 25_000;

export const FORM_ERROR_MESSAGES: Record<LocaleEnum, Record<Exclude<FormErrorCode, 'generic'>, string>> = {
  en: {
    rate: 'Too many attempts. Please wait a little before trying again, or message Tais on Instagram.',
    captcha: "We couldn't confirm you're not a bot. Please try sending again.",
    invalid: "Some details don't look right. Please check the form and try again.",
    unavailable: 'Sending is temporarily unavailable. Please try again later or message Tais on Instagram.',
    timeout: 'This is taking too long. Please check your connection and try again.',
    turnstile:
      "The spam check couldn't load. Please turn off ad or tracker blockers for this site, or refresh the page.",
  },
  sr: {
    rate: 'Previše pokušaja. Sačekajte malo pre nego što pokušate ponovo ili pišite Taisi na Instagramu.',
    captcha: 'Nismo uspeli da potvrdimo da niste bot. Pokušajte ponovo da pošaljete.',
    invalid: 'Neki podaci nisu ispravni. Proverite formu i pokušajte ponovo.',
    unavailable: 'Slanje trenutno nije moguće. Pokušajte kasnije ili pišite Taisi na Instagramu.',
    timeout: 'Ovo traje predugo. Proverite internet vezu i pokušajte ponovo.',
    turnstile:
      'Provera protiv spama nije uspela da se učita. Isključite blokatore reklama za ovaj sajt ili osvežite stranicu.',
  },
  ru: {
    rate: 'Слишком много попыток. Подождите немного и попробуйте снова или напишите Таис в Instagram.',
    captcha: 'Не удалось подтвердить, что вы не бот. Попробуйте отправить ещё раз.',
    invalid: 'Некоторые данные указаны неверно. Проверьте форму и попробуйте снова.',
    unavailable: 'Отправка временно недоступна. Попробуйте позже или напишите Таис в Instagram.',
    timeout: 'Это занимает слишком много времени. Проверьте подключение и попробуйте снова.',
    turnstile:
      'Не удалось загрузить проверку от спама. Отключите блокировщики рекламы для этого сайта или обновите страницу.',
  },
};
