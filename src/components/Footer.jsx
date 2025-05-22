import { FaGithub, FaCode, FaHeart } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-primary-light py-6 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 text-sm">
              <FaGithub className="text-secondary" />
              <span>GitHub Student Ranking SMVTIM</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
          <p className="flex items-center justify-center">
            Made by Sumedh with <FaHeart className="mx-1 text-secondary" />
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer