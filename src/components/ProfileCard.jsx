import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaCodeBranch, FaUsers, FaUserFriends, FaExternalLinkAlt, FaUserPlus } from 'react-icons/fa'
import { IoStatsChart } from 'react-icons/io5'
import axios from 'axios'

function ProfileCard({ profile, onStudentAdded }) {
  const [isHovered, setIsHovered] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Activity score is represented as a percentage out of 100
  const activityScore = profile.activityScore || 0;
  
  // Determine rank color based on activity score
  const getRankColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-accent';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };
  
  const rankColor = getRankColor(activityScore);

  const handleAddStudent = async () => {
    setAdding(true);
    try {
      // Use full backend URL to avoid 404 error
      await axios.post('http://localhost:5000/api/students/add', {
        githubId: profile.id,
        login: profile.login,
        name: profile.name,
        avatar_url: profile.avatar_url,
      });
      setAdded(true);
      if (onStudentAdded) onStudentAdded();
    } catch (err) {
      alert('Failed to add student');
    }
    setAdding(false);
  };

  return (
    <motion.div
      className="card h-full"
      whileHover={{ 
        y: -5,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' 
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative">
            <motion.img 
              src={profile.avatar_url || "https://via.placeholder.com/100"}
              alt={`${profile.login}'s avatar`}
              className="w-16 h-16 rounded-full object-cover border-2 border-secondary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Rank badge */}
          </div>
          
          <div className="ml-4">
            <h3 className="text-xl font-semibold">{profile.name || profile.login}</h3>
            <a 
              href={profile.html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-secondary-light text-sm flex items-center"
            >
              @{profile.login}
              <FaExternalLinkAlt className="ml-1 text-xs" />
            </a>
          </div>
        </div>
        
        <div className="mb-4">
          {profile.bio && (
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>
        
        {/* Activity Meter */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
              <IoStatsChart className="mr-1" /> GitHub Activity
            </span>
            <span className={`text-sm font-medium ${rankColor}`}>
              {activityScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full bg-current ${rankColor}`}
              style={{ width: `${activityScore}%` }}
              initial={{ width: '0%' }}
              animate={{ width: `${activityScore}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
              <FaCodeBranch className="mr-1 text-secondary" />
              <span className="text-sm">Repos</span>
            </div>
            <span className="font-semibold">{profile.public_repos || 0}</span>
          </div>

          {/* Recent Commit Date Card */}
          <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
              <FaCodeBranch className="mr-1 text-secondary" />
              <span className="text-sm">Recent Commit</span>
            </div>
            <span className="font-semibold">
              {profile.repos && profile.repos.length > 0
                ? new Date(
                    profile.repos
                      .map(r => r.updated_at)
                      .sort()
                      .reverse()[0]
                  ).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>

          <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
              <FaUsers className="mr-1 text-primary-light" />
              <span className="text-sm">Following</span>
            </div>
            <span className="font-semibold">{profile.following || 0}</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
              <FaUserFriends className="mr-1 text-success" />
              <span className="text-sm">Followers</span>
            </div>
            <span className="font-semibold">{profile.followers || 0}</span>
          </div>
        </div>
        
        <motion.a
          href={profile.html_url}
          target="_blank"
          rel="noopener noreferrer" 
          className="btn btn-secondary w-full flex items-center justify-center mb-2"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          View Full Profile
        </motion.a>

        <button
          className={`btn w-full flex items-center justify-center ${added ? 'btn-success' : 'btn-primary'}`}
          onClick={handleAddStudent}
          disabled={adding || added}
        >
          <FaUserPlus className="mr-2" />
          {added ? 'Added' : adding ? 'Adding...' : 'Add to My Students'}
        </button>
      </div>
    </motion.div>
  )
}

export default ProfileCard