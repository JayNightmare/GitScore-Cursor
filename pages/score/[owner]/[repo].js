/**
 * Dynamic page for displaying repository scores
 * Uses client-side data fetching for all repositories
 */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CountUp from 'react-countup';
import Head from 'next/head';

export default function ScorePage() {
  const router = useRouter();
  const { owner, repo } = router.query;
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!owner || !repo) return;

    const fetchScore = async () => {
      try {
        // Fetch repository data from GitHub REST API
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!response.ok) throw new Error('Repository not found');
        
        const repoData = await response.json();

        // Calculate score based on available metrics
        const score = {
          score: Math.min(
            (repoData.stargazers_count / 100) +
            (repoData.forks_count / 50) +
            (repoData.has_issues ? 2 : 0) +
            (repoData.has_wiki ? 1 : 0) +
            (repoData.has_pages ? 1 : 0) +
            (repoData.license ? 1.5 : 0) +
            (repoData.description ? 1 : 0),
            10
          ),
          breakdown: {
            stars: { score: Math.min(repoData.stargazers_count / 100, 10), weight: 1 },
            forks: { score: Math.min(repoData.forks_count / 50, 10), weight: 0.8 },
            issues: { score: repoData.has_issues ? 10 : 0, weight: 0.5 },
            wiki: { score: repoData.has_wiki ? 10 : 0, weight: 0.3 },
            pages: { score: repoData.has_pages ? 10 : 0, weight: 0.3 },
            license: { score: repoData.license ? 10 : 0, weight: 0.5 },
            description: { score: repoData.description ? 10 : 0, weight: 0.3 },
          },
        };

        setScore(score);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [owner, repo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !score) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">
          {error || 'Repository not found or error occurred'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{`${owner}/${repo} - GitHub Score`}</title>
        <meta name="description" content={`GitHub repository score for ${owner}/${repo}`} />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
            {owner}/{repo}
          </h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Repository Score</h2>
              <div className="text-5xl font-bold text-primary">
                <CountUp end={score.score} duration={2} decimals={1} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Score Breakdown</h3>
              {Object.entries(score.breakdown).map(([key, metric]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800 font-medium">{metric.score.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">(×{metric.weight})</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <a
                href="/"
                className="text-primary hover:text-primary-dark"
              >
                ← Back to Search
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 