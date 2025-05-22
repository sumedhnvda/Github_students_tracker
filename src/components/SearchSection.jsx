import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaSpinner } from 'react-icons/fa'
import { searchGitHubUsers } from '../services/githubService'

function SearchSection({ setSearchResults, setIsLoading, setError }) {
  const [query, setQuery] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLocalLoading(true);
    setIsLoading(true);
    setError(null);
    
    try {
      // Extract username from GitHub URL if provided
      let searchQuery = query.trim();
      if (searchQuery.includes('github.com/')) {
        searchQuery = searchQuery.split('github.com/').pop().split('/')[0];
      }
      
      const results = await searchGitHubUsers(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setError(err.message || 'Failed to search GitHub users');
      setSearchResults([]);
    } finally {
      setLocalLoading(false);
      setIsLoading(false);
    }
  };
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            Find and Rank Student GitHub Profiles
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Search for students by username ,link or email and analyze their GitHub activity
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter student GitHub username or email"
              className="input w-full pl-12 py-4 text-lg shadow-sm"
              disabled={localLoading}
            />
            <motion.span 
              className="absolute left-4 text-gray-500 dark:text-gray-400"
              animate={{ scale: localLoading ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: localLoading ? Infinity : 0, duration: 1 }}
            >
              {localLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="btn btn-primary ml-2 py-4 px-6 text-lg"
              disabled={localLoading || !query.trim()}
            >
              Search
            </motion.button>
          </div>
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Examples: "sumedhnvda", "https://github.com/sumedhnvda", "sumedhnavuda@outlook.com"</span>
          </div>
        </form>
      </div>
    </motion.section>
  )
}

export default SearchSection