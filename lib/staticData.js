/**
 * Static data fetching utilities
 * Used during build time to pre-generate repository scores
 */
import { MongoClient } from 'mongodb';
import { fetchRepoData } from './github';
import { calculateScore } from './scoring';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client.db('github-scorer');
}

export async function getRepositoryScore(owner, repo) {
  try {
    const db = await connectToDatabase();
    const cache = db.collection('scores');

    // Check cache
    const cachedResult = await cache.findOne({
      owner,
      repo,
      timestamp: { $gt: new Date(Date.now() - CACHE_DURATION) }
    });

    if (cachedResult) {
      return cachedResult.score;
    }

    // Fetch fresh data
    const repoData = await fetchRepoData(owner, repo);
    const score = calculateScore(repoData);

    // Cache result
    await cache.updateOne(
      { owner, repo },
      {
        $set: {
          owner,
          repo,
          score,
          timestamp: new Date()
        }
      },
      { upsert: true }
    );

    return score;
  } catch (error) {
    console.error('Error fetching repository score:', error);
    return null;
  }
} 