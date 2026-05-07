// src/hooks/useTreeTitle.ts
import { useTranslation } from 'react-i18next';
import { getTreeTitle } from '../shared/helpers/getTreeTitle';

export const useTreeTitle = () => {
  const { i18n } = useTranslation();

  return (title: { [key: string]: string }) =>
    getTreeTitle(i18n.language, title);
};
