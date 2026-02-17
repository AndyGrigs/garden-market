import { motion } from '@/utils/motionComponents'
import { Heart } from 'lucide-react'

export const StorySection = () => {
  return (
     <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                  <Heart className="h-8 w-8 text-emerald-600 mr-3" />
                  Наша история
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Семья Ковач начала заниматься выращиванием саженцев более 5 лет назад.
                    Это началось как небольшое хобби, но постепенно переросло в семейный бизнес,
                    которым мы гордимся.
                  </p>
                  <p>
                    За годы работы мы накопили богатый опыт в выращивании различных видов деревьев
                    и кустарников, адаптированных к климату Молдовы. Наши саженцы выращиваются с любовью
                    и заботой, что гарантирует их высокое качество и приживаемость.
                  </p>
                  <p>
                    Наша миссия - помочь людям создавать красивые зеленые пространства,
                    которые будут радовать их и их семьи на протяжении многих лет.
                  </p>
                </div>
              </div>
              {/* <div className="relative">
                <img
                  src="/api/placeholder/500/400"
                  alt="Семейный бизнес"
                  className="rounded-lg shadow-lg w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-emerald-600 bg-opacity-20 rounded-lg"></div>
              </div> */}
            </div>
          </div>
        </motion.section>
  )
}
