import { motion } from 'framer-motion'
import { FaGithub, FaUserFriends } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <FaGithub className="text-secondary text-3xl" />
          <Link to="/" className="text-xl md:text-2xl font-bold hover:underline focus:outline-none">
            GitHub Student Ranking SMVTIM
          </Link>
        </motion.div>
        
        <motion.nav 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/my_students"
                className="flex items-center bg-secondary text-black px-3 py-1 rounded hover:bg-secondary-dark transition"
              >
                <FaUserFriends className="mr-2" />
                My Students
              </Link>
            </li>
          </ul>
        </motion.nav>
      </div>
    </header>
  )
}

export default Header