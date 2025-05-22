import axios from 'axios';

const githubToken = import.meta.env.VITE_GITHUB_TOKEN;

if (!githubToken) {
  console.error('GitHub token not found! Add VITE_GITHUB_TOKEN to .env file');
}

export const githubAPI = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${githubToken}`,
  },
});

// Calculate activity score based on various metrics
const calculateActivityScore = (profile, repos) => {
  // Base score components
  const repoScore = Math.min(profile.public_repos / 30, 1) * 25; // Max 25 points
  const followerScore = Math.min(profile.followers / 50, 1) * 15; // Max 15 points

  // Repo quality metrics
  let commitScore = 0;
  let updatedScore = 0;

  if (repos.length > 0) {
    // Calculate recency of updates (max 20 points)
    const now = new Date();
    const recentUpdates = repos.filter(repo => {
      const updatedDate = new Date(repo.updated_at);
      const monthsDiff = (now.getFullYear() - updatedDate.getFullYear()) * 12 +
                         now.getMonth() - updatedDate.getMonth();
      return monthsDiff <= 3; // Updated in last 3 months
    }).length;

    updatedScore = (recentUpdates / repos.length) * 20;

    // Estimate commit activity (max 20 points)
    // Without commit API access, we'll use the creation vs update date as a proxy
    let activitySum = 0;
    repos.forEach(repo => {
      const createdDate = new Date(repo.created_at);
      const updatedDate = new Date(repo.updated_at);
      const daysDiff = (updatedDate - createdDate) / (1000 * 60 * 60 * 24);

      if (daysDiff > 0 && repo.updated_at !== repo.created_at) {
        activitySum += Math.min(daysDiff / 30, 10); // Cap at 10 months of activity
      }
    });

    commitScore = Math.min(activitySum / 30, 1) * 20;
  }

  // Final score (0-80)
  const totalScore = repoScore + followerScore + updatedScore + commitScore;
  return Math.round(totalScore);
};

// Search GitHub users
export const searchGitHubUsers = async (query) => {
  try {
    // Search for users
    const searchResponse = await githubAPI.get('/search/users', {
      params: {
        q: query,
        per_page: 12, // Limit to 12 results
      }
    });
    
    // For each user, get detailed profile and repos
    const userPromises = searchResponse.data.items.map(async (user) => {
      // Get user profile
      const userResponse = await githubAPI.get(`/users/${user.login}`);
      
      // Get user repositories
      const reposResponse = await githubAPI.get(`/users/${user.login}/repos`, {
        params: {
          sort: 'updated',
          per_page: 10 // Limit to most recent 10 repos
        }
      });
       
      // Calculate activity score
      const activityScore = calculateActivityScore(userResponse.data, reposResponse.data);
      
      // Calculate ranking (0-1 scale)
      const ranking = activityScore / 100;
      
      // Return combined data
      return {
        ...userResponse.data,
        repositories: userResponse.data.public_repos,
        activityScore,
        ranking,
        repos: reposResponse.data.map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language,
          updated_at: repo.updated_at,
          html_url: repo.html_url
        }))
      };
    });
    
    // Wait for all promises to resolve
    const enhancedUsers = await Promise.all(userPromises);
    
    // Sort by ranking (highest first)
    return enhancedUsers.sort((a, b) => b.ranking - a.ranking);
  } catch (error) {
    console.error('GitHub API Error:', error);
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch GitHub data. Please try again later.'
    );
  }
};