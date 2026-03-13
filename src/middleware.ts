import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'fr'
});

export const config = {
  matcher: ['/', '/(fr|en|de)/:path*']
};