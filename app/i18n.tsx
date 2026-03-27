import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

/**
 * i18n configuration for customer visits feature
 */
export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale')?.value;
  const locale = localeCookie === 'en' || localeCookie === 'de' ? localeCookie : 'de';

  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
