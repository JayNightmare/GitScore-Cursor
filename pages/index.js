/**
 * Main page component
 * Displays search form and repository score card
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Use Next.js router for client-side navigation
      await router.push(`/score/${owner}/${repo}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>GitHub Repository Scorer</title>
        <meta name="description" content="Score GitHub repositories based on various metrics" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          GitHub Repository Scorer
        </h1>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                Repository Owner
              </label>
              <input
                type="text"
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="repo" className="block text-sm font-medium text-gray-700">
                Repository Name
              </label>
              <input
                type="text"
                id="repo"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Calculating...' : 'Calculate Score'}
            </button>
          </div>
        </form>

        {error && (
          <div className="max-w-md mx-auto p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </main>
    </div>
  );
} 