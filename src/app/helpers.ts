import * as _ from 'lodash';
export interface TranslationNode {
  key: string;
  en: string;
  nl: string;
  fr: string;
}

export function inflateNodes(data: TranslationNode[]): { en: any; fr: any; nl: any } {
  const res: { en: any; fr: any; nl: any } = { en: {}, fr: {}, nl: {} };
  data.forEach(item => {
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

export function extractNodes(json: any): TranslationNode[] {
  const res: TranslationNode[] = [];
  if (json === undefined) {
    return res;
  }

  Object.keys(json).forEach(key => {
    if (typeof json[key] === 'string') {
      res.push({ key: key, en: json[key], fr: json[key], nl: json[key] });
    } else {
      const childs = extractNodes(json[key]);
      childs.forEach((child: TranslationNode) =>
        res.push(<TranslationNode>{
          key: `${key}.${child.key}`,
          en: child.en,
          nl: child.nl,
          fr: child.fr
        })
      );
    }
  });
  return res;
}
