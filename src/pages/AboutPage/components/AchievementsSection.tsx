import { achievements } from '../data/aboutData';
import { motion } from '@/utils/motionComponents';

export const AchievementsSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-16"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">
              {achievement.number}
            </div>
            <div className="text-gray-600 text-sm md:text-base">
              {achievement.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
