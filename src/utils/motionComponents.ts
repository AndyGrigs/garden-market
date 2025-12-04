// Замість імпорту всього framer-motion, імпортуй тільки потрібне
import { motion as m } from 'framer-motion';

// Експортуй тільки те що використовуєш
export const motion = {
  div: m.div,
  form: m.form,
  button: m.button,
  span: m.span,
  a: m.a,
  section: m.section,
  ul: m.ul,
  li: m.li,
  img: m.img,
};

// Експортуй тільки потрібні хуки та компоненти
export { AnimatePresence } from 'framer-motion';
