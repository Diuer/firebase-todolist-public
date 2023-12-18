import { useTranslation } from "react-i18next";

const useLocales = () => {
  const { t: translate, i18n } = useTranslation();

  return {
    translate,
    changeLanguage: (lang) => i18n.changeLanguage(lang),
    currentLanguage: i18n.language,
    languageOptios: i18n.languages,
  };
};

export default useLocales;
