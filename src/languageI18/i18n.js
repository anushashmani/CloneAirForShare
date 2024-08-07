import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "../LangJsonFile/en.json";
import urTranslation from "../LangJsonFile/ur.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  ur: {
    translation: urTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
