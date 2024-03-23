import translate from "translate";

translate.engine = "google";

const getTranslation = async (text: string, lang: string) => {
  const translation = await translate(text, {
    to: "en",
    from: lang.slice(0, 2),
  });
  console.log("translation :", translation);

  return translation;
};

export default getTranslation;
