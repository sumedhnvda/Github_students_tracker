import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationTriangle } from 'react-icons/fa'
import ProfileCard from './ProfileCard'
import EmptyState from './EmptyState'
import LoadingState from './LoadingState'
import { githubAPI } from '../services/githubService'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function ResultsSection({ results, isLoading, error }) {
  const [sortedResults, setSortedResults] = useState([]);
  
  useEffect(() => {
    if (results.length) {
      // Fetch additional details using authenticated API
      const fetchDetails = async () => {
        try {
          const detailedResults = await Promise.all(
            results.map(async (profile) => {
              const userRes = await githubAPI.get(`/users/${profile.login}`);
              return {
                ...profile,
                ...userRes.data
              };
            })
          );
          setSortedResults(detailedResults);
        } catch (err) {
          console.error('Error fetching details:', err);
        }
      };
      fetchDetails();
    } else {
      setSortedResults([]);
    }
  }, [results]);
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-error">
        <FaExclamationTriangle className="text-4xl mb-4" />
        <p className="text-xl font-medium mb-2">Error</p>
        <p className="text-center max-w-md">{error}</p>
      </div>
    );
  }
  
  if (!results.length) {
    return <EmptyState />;
  }
  
  return (
    <section className="mb-10">
      <div>
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-6">
          Search Results
          <span className="ml-2 text-gray-500 dark:text-gray-400 text-lg font-normal">
            ({sortedResults.length} students)
          </span>
        </h2>
        
        <AnimatePresence>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedResults.map((profile) => (
              <motion.div 
                key={profile.id} 
                variants={itemVariants}
                layout
                className="h-full"
              >
                <ProfileCard profile={profile} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

export default ResultsSection