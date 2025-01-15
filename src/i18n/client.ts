'use client';
import {useEffect, useState} from 'react';
import i18next from 'i18next';
import {initReactI18next, useTranslation} from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Locales, LANGUAGE_COOKIE, getOptions, supportedLocales } from './settings';
import { themeConfig } from '@/hooks/use-config';


const runsOnServerSide = typeof window === 'undefined';

// Initialize i18next for the client side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (lang: string, ns: string) => import(`./locales/${lang}/${ns}.json`),
    ),
  )
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['cookie'],
      lookupCookie: LANGUAGE_COOKIE,
      caches: ['cookie'],
    },
    preload: runsOnServerSide ? supportedLocales : [],
  });

export function useClientTranslation(ns: string) {
  const [config] = themeConfig(); 
  const lng = config.lang as Locales

  // const lng = useLocale();
  const translator = useTranslation(ns); 
  const {i18n} = translator;

  // Run content is being rendered on server side
  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (activeLng === i18n.resolvedLanguage) return
      setActiveLng(i18n.resolvedLanguage)
    }, [activeLng, i18n.resolvedLanguage]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (!lng || i18n.resolvedLanguage === lng) return
      i18n.changeLanguage(lng)
    }, [lng, i18n])
  }
  return translator;
}