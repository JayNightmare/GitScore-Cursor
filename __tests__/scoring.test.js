/**
 * Unit tests for repository scoring logic
 */
import { calculateScore } from '../lib/scoring';

describe('calculateScore', () => {
  const mockRepoData = {
    object: { text: 'README content' },
    licenseInfo: { name: 'MIT' },
    stargazerCount: 150,
    forkCount: 30,
    defaultBranchRef: {
      target: {
        history: {
          nodes: [
            { committedDate: new Date().toISOString() },
            { committedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
          ],
        },
      },
    },
    workflows: {
      nodes: [
        { name: 'CI', state: 'ACTIVE' },
        { name: 'Deploy', state: 'ACTIVE' },
      ],
    },
  };

  it('calculates correct score for a well-maintained repository', () => {
    const result = calculateScore(mockRepoData);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(10);
    expect(result.breakdown).toHaveProperty('readme');
    expect(result.breakdown).toHaveProperty('license');
    expect(result.breakdown).toHaveProperty('stars');
    expect(result.breakdown).toHaveProperty('forks');
    expect(result.breakdown).toHaveProperty('recentCommits');
    expect(result.breakdown).toHaveProperty('ciWorkflows');
  });

  it('handles missing data gracefully', () => {
    const minimalData = {
      stargazerCount: 0,
      forkCount: 0,
    };
    const result = calculateScore(minimalData);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(10);
  });

  it('normalizes scores correctly', () => {
    const result = calculateScore(mockRepoData);
    Object.values(result.breakdown).forEach(metric => {
      expect(metric.score).toBeGreaterThanOrEqual(0);
      expect(metric.score).toBeLessThanOrEqual(10);
    });
  });
}); 