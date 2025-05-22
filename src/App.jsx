import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import SearchSection from './components/SearchSection'
import ResultsSection from './components/ResultsSection'
import Footer from './components/Footer'
import MyStudents from './components/MyStudents'

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchSection 
                  setSearchResults={setSearchResults} 
                  setIsLoading={setIsLoading}
                  setError={setError}
                />
                <ResultsSection 
                  results={searchResults}
                  isLoading={isLoading}
                  error={error}
                />
              </>
            }
          />
          <Route path="/my_students" element={<MyStudents />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App