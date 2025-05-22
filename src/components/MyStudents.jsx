import { useEffect, useState } from 'react'
import axios from 'axios'
import { FaCodeBranch, FaUsers, FaUserFriends, FaExclamationCircle } from 'react-icons/fa'
import { githubAPI } from '../services/githubService'

function MyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inactiveStudents, setInactiveStudents] = useState([]);
  const [topContributors, setTopContributors] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // 1. Get student logins from backend
        const res = await axios.get('http://localhost:5000/api/students/ranked');
        const studentsFromDb = res.data;

        // 2. For each student, fetch all details and activity
        const detailedStudents = await Promise.all(
          studentsFromDb.map(async (student) => {
            try {
              // Fetch user details
              const userRes = await githubAPI.get(`/users/${student.login}`);
              // Fetch repos and commits
              const reposRes = await githubAPI.get(`/users/${student.login}/repos?per_page=100&sort=updated`);
              const repos = reposRes.data || [];

              // Get recent commits (last 30 days)
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

              // Check each repo for recent commits
              const recentActivity = await Promise.all(
                repos.map(async (repo) => {
                  try {
                    const commitsRes = await githubAPI.get(
                      `/repos/${student.login}/${repo.name}/commits?since=${thirtyDaysAgo.toISOString()}`
                    );
                    return commitsRes.data.length;
                  } catch (err) {
                    return 0;
                  }
                })
              );

              const totalRecentCommits = recentActivity.reduce((a, b) => a + b, 0);

              return {
                githubId: userRes.data.id,
                login: userRes.data.login,
                name: userRes.data.name,
                avatar_url: userRes.data.avatar_url,
                public_repos: userRes.data.public_repos,
                following: userRes.data.following,
                followers: userRes.data.followers,
                recent_commit: repos.length > 0 ? repos[0].updated_at : null,
                commits_last_30_days: totalRecentCommits
              };
            } catch (err) {
              return { 
                login: student.login, 
                commits_last_30_days: 0,
                // ... other fallback properties
              };
            }
          })
        );

        // Set all students
        setStudents(detailedStudents);

        // Set top 10 contributors
        const sortedByCommits = [...detailedStudents].sort(
          (a, b) => b.commits_last_30_days - a.commits_last_30_days
        );
        setTopContributors(sortedByCommits.slice(0, 10));

        // Set inactive students (no commits in 30 days)
        setInactiveStudents(
          detailedStudents.filter(s => s.commits_last_30_days === 0)
        );

      } catch (err) {
        console.error('Error fetching students:', err);
        setStudents([]);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Contributors Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top 10 Contributors</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topContributors.map((s, idx) => (
            <div key={s.githubId} className="card bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <img src={s.avatar_url} alt={s.login} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h3 className="font-semibold">{s.name || s.login}</h3>
                  <p className="text-sm text-gray-500">@{s.login}</p>
                </div>
              </div>
              <div className="text-center p-2 bg-secondary/10 rounded-lg">
                <span className="block text-2xl font-bold text-secondary">
                  {s.commits_last_30_days}
                </span>
                <span className="text-sm text-gray-600">commits in 30 days</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inactive Students Section */}
      {inactiveStudents.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-error">
            <FaExclamationCircle className="inline-block mr-2" />
            Inactive Students (No commits in 30 days)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveStudents.map(s => (
              <div key={s.githubId} className="card bg-error/5 shadow rounded-lg p-4">
                <div className="flex items-center">
                  <img src={s.avatar_url} alt={s.login} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <h3 className="font-medium">{s.name || s.login}</h3>
                    <p className="text-sm text-gray-500">@{s.login}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Original students list can follow here */}
    </div>
  );
}

export default MyStudents;