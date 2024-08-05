import { Languages } from './step1/step1.component';

export interface TranslationNode extends Partial<Record<Languages, string>> {
  key: string;
}

export function inflateNodes(data: TranslationNode[]): {
  en_gb: any;
  fr_be: any;
  nl_be: any;
} {
  const res: Record<Languages, any> = { en_gb: {}, fr_be: {}, nl_be: {} };
  data.forEach((item) => {
    if (item.en_gb !== undefined) {
      setField(res.en_gb, item.key, item['en_gb']);
    }
    if (item.nl_be !== undefined) {
      setField(res.nl_be, item.key, item['nl_be']);
    }
    if (item.fr_be !== undefined) {
      setField(res.fr_be, item.key, item['fr_be']);
    }
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
