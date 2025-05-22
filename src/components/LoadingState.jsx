import { motion } from 'framer-motion'
import { FaGithub } from 'react-icons/fa'

function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
        }}
        className="text-6xl text-secondary mb-6"
      >
        <FaGithub />
      </motion.div>
      
      <h3 className="text-xl font-semibold mb-3">Analyzing GitHub Profiles</h3>
      
      <div className="flex space-x-2 mb-4">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-3 h-3 bg-secondary rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: dot * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
        We're calculating activity scores and ranking profiles based on contributions, 
        repositories, stars, and more.
      </p>
    </motion.div>
  )
}

export default LoadingState