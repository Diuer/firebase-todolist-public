import * as Yup from "yup";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import localeCn from "../locales/resources/cn.json";
import localeEn from "../locales/resources/en.json";

Yup.setLocale({
  string: {
    min: ({ label, min, originalValue, path, value }) =>
      i18next.t("validate.length.must.moreThan", {
        min,
      }),
    max: ({ label, max, originalValue, path, value }) =>
      i18next.t("validate.length.must.lessThan", {
        max,
      }),
  },
  mixed: {
    required: i18next.t("validate.required"),
  },
});

Yup.addMethod(Yup.string, "noSpace", function (option = {}) {
  return this.test("noSpace", function (value = "") {
    const { allowEmpty = false } = option;
    const trimValue = value.trim();

    if (!allowEmpty && !trimValue) {
      return this.createError({
        path: this.path,
        message: i18next.t("validate.empty"),
      });
    }
    if (value.length !== trimValue.length) {
      return this.createError({
        path: this.path,
        message: i18next.t("validate.invalid.space.betweenBeginAndEnd"),
      });
    }
    return true;
  });
});

const LANGUAGES = [
  {
    key: "cn",
    value: localeCn,
  },
  {
    key: "en",
    value: localeEn,
  },
];

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    lng: "cn", // if you're using a language detector, do not define the lng option
    fallbackLng: "cn",
    debug: true,
    resources: LANGUAGES.reduce((accumulate, item) => {
      accumulate[item.key] = { translation: item.value };
      return accumulate;
    }, {}),
  });
