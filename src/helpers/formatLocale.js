import moment from 'moment';

const localeDict = {
  ru: 'Русский',
  'en-US': 'English',
  es: 'Español',
  'it-IT': 'Italiano',
  'fr-FR': 'Français',
  'pt-PT': 'Português',
  'cs-CZ': 'Czech',
  ar: 'العربية',
};

const rtlLocateDict = ['ar'];

export function formatLocale(locale) {
  return localeDict[locale] || 'English';
}

export function isRTL(locale) {
  return locale && rtlLocateDict.indexOf(locale) >= 0;
}

export function generateMomentLocaleSettings(locale) {
  const localeData = moment.localeData('en');
  const response = {
    ordinal: localeData.ordinal(),
  };
  return response;
}
