import { Languages } from './step1/step1.component';

export interface TranslationNode extends Partial<Record<Languages, string>> {
  key: string;
}

export function inflateNodes(
  data: TranslationNode[],
  languages: Languages[]
): Partial<Record<Languages, any>> {
  const res: Partial<Record<Languages, any>> = {};
  languages.forEach((lang) => {
    res[lang] = {};
  });
  data.forEach((item: TranslationNode) => {
    languages
      .filter((lang: Languages) => item[lang] !== undefined)
      .forEach((lang) => {
        setField(res[lang], item.key, item[lang]!);
      });
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
  lang?: Languages
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
