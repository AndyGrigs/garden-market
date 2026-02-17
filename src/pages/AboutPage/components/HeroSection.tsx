import { motion } from "@/utils/motionComponents"

export const HeroSection = () => {
  return (
      <div className="bg-emerald-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                О нашей семье
              </h1>
              <p className="text-xl text-emerald-100 max-w-2xl">
                Семья Ковач уже более 5 лет занимается выращиванием и продажей качественных саженцев деревьев
              </p>
            </motion.div>
          </div>
        </div>
      </div>

  )
}
