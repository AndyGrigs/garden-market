import { motion } from '@/utils/motionComponents';
import { Users } from 'lucide-react';
import { teamMembers } from '../data/aboutData';

export const TeamSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mb-16"
    >
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center">
        <Users className="h-8 w-8 text-emerald-600 mr-3" />
        Наша команда
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* <img
              src={member.image}
              alt={member.name}
              className="w-full h-48 object-cover"
            /> */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {member.name}
              </h3>
              <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
              <p className="text-sm text-gray-500 mb-3">{member.experience}</p>
              <p className="text-gray-600 text-sm">{member.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
