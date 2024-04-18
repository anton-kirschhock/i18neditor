export interface TranslationNode {
  key: string;
  en: string;
  nl: string;
  fr: string;
}

export function inflateNodes(data: TranslationNode[]): {
  en: any;
  fr: any;
  nl: any;
} {
  const res: { en: any; fr: any; nl: any } = { en: {}, fr: {}, nl: {} };
  data.forEach((item) => {
    setField(res.en, item.key, item.en);
    setField(res.nl, item.key, item.nl);
    setField(res.fr, item.key, item.fr);
  });
  return res;
}

export function setField(obj: any, field: string, value: string) {
  const sections = field.split('.');
  let subObj = obj;
  for (let i = 0; i <= sections.length - 1; i++) {
    if (i === sections.length - 1) {
      subObj[sections[i]] = value;
      return;
    } else {
      if (subObj[sections[i]] === undefined) {
        subObj[sections[i]] = {};
      }

      subObj = subObj[sections[i]];
    }
  }
}

export function extractNodes(
  json: any,
  lang?: 'en' | 'fr' | 'nl'
): { key: string; value: string }[] {
  const res: { key: string; value: string }[] = [];
  if (json === undefined) {
    return res;
  }

  Object.keys(json).forEach((key) => {
    if (typeof json[key] === 'string') {
      res.push({ key: key, value: json[key] });
    } else {
      const childs = extractNodes(json[key]);
      childs.forEach((child) =>
        res.push({
          key: `${key}.${child.key}`,
          value: child.value,
        })
      );
    }
  });
  return res;
}
