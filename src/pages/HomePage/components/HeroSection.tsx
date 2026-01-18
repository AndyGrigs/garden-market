// ✅ ЩО ТУТ:
// - Тільки UI
// - Анімації
// - Статичний контент
// - Можливо локальний useState для UI (наприклад, accordion)

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const HeroSection = () => {
  const { t } = useTranslation();

  // ✅ Можна: локальний UI стан
  const [isExpanded, setIsExpanded] = useState(false);

  // ❌ НЕ можна: API виклики, складна логіка
  
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="hero-section"
    >
      <h1>{t('home.hero.title')}</h1>
      <p>{t('home.hero.subtitle')}</p>
      
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {t('common.learnMore')}
      </button>
    </motion.section>
  );
};