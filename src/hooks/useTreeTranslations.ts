import { useLanguage } from './useLanguage';

export const useTreeTitle = () => {
  const lang = useLanguage();
  
  return (title: { [key: string]: string }) => {
    return title?.[lang] || title?.en || title?.ru || title?.ro || "";
  };
};

export const useTreeDescription = () => {
  const lang = useLanguage();
  
  return (description: { [key: string]: string }) => {
    return description?.[lang] || description?.en || description?.ru || description?.ro || "";
  };
};