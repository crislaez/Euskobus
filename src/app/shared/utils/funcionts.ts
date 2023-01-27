import { IonContent } from "@ionic/angular";

export const trackById = (_: number, item: any): number => {
  return item?.id ?? item?.name ?? item;
}

export const errorImage = (event: any): void => {
  event.target.src = 'assets/images/image_not_found.png';
}

export const isNotEmptyObject = (object: any): boolean => {
  return Object.keys(object || {})?.length > 0
}

export const getObjectKeys = (obj: any): any => {
  return Object.keys(obj || {})
}

export const gotToTop = (content: IonContent): void => {
  content?.scrollToTop(500);
}

export const sliceText = (text: string, slice: number) => {
  return text?.length > slice ? text?.slice(0, slice) + '...' : text;
}

export const getLastNumber = (number: number): number => {
  return Number(number?.toString()?.slice(-1))
};

export const sliceDate = (completeDate: string): string => {
  const [ date = null ] = completeDate?.split('T') || [];
  return date || completeDate
}

export const shortObjData = (list: any[], field:string) => {
  return [...(list ?? [])]?.sort((a,b) => {
    if(a?.[field] < b?.[field]) return 1;
    if(b?.[field] > a?.[field]) return -1;
    return 0;
  })
}

export const shortData = (keys: string[]) => {
  return [...(keys ?? [])]?.sort((a,b) => {
    if(a < b) return 1;
    if(a > b) return -1;
    return 0;
  })
}

export const uniqueIdGeneratos = () => {
  let d = new Date().getTime();
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
