import { motion } from 'framer-motion'
import { FaGithub, FaSearch } from 'react-icons/fa'

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-6 relative">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <FaGithub className="text-7xl text-gray-300 dark:text-gray-600" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0"
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        >
          <FaSearch className="text-3xl text-secondary" />
        </motion.div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Search for Student GitHub Profiles</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
      </p>
    </motion.div>
  )
}

export default EmptyState