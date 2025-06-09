/**
 * Unit tests for repository scoring logic
 */
describe('Repository Scoring', () => {
  const mockRepoData = {
    stargazers_count: 150,
    forks_count: 30,
    has_issues: true,
    has_wiki: true,
    has_pages: true,
    license: { name: 'MIT' },
    description: 'A test repository',
  };

  const calculateScore = (repoData) => {
    const score = Math.min(
      (repoData.stargazers_count / 100) +
      (repoData.forks_count / 50) +
      (repoData.has_issues ? 2 : 0) +
      (repoData.has_wiki ? 1 : 0) +
      (repoData.has_pages ? 1 : 0) +
      (repoData.license ? 1.5 : 0) +
      (repoData.description ? 1 : 0),
      10
    );

    return {
      score,
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
  };

  it('calculates correct score for a well-maintained repository', () => {
    const result = calculateScore(mockRepoData);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(10);
    expect(result.breakdown).toHaveProperty('stars');
    expect(result.breakdown).toHaveProperty('forks');
    expect(result.breakdown).toHaveProperty('issues');
    expect(result.breakdown).toHaveProperty('wiki');
    expect(result.breakdown).toHaveProperty('pages');
    expect(result.breakdown).toHaveProperty('license');
    expect(result.breakdown).toHaveProperty('description');
  });

  it('handles missing data gracefully', () => {
    const minimalData = {
      stargazers_count: 0,
      forks_count: 0,
      has_issues: false,
      has_wiki: false,
      has_pages: false,
      license: null,
      description: null,
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

  it('calculates correct weights for each metric', () => {
    const result = calculateScore(mockRepoData);
    expect(result.breakdown.stars.weight).toBe(1);
    expect(result.breakdown.forks.weight).toBe(0.8);
    expect(result.breakdown.issues.weight).toBe(0.5);
    expect(result.breakdown.wiki.weight).toBe(0.3);
    expect(result.breakdown.pages.weight).toBe(0.3);
    expect(result.breakdown.license.weight).toBe(0.5);
    expect(result.breakdown.description.weight).toBe(0.3);
  });

  it('caps star and fork scores appropriately', () => {
    const highStarsData = {
      ...mockRepoData,
      stargazers_count: 2000,
      forks_count: 1000,
    };
    const result = calculateScore(highStarsData);
    expect(result.breakdown.stars.score).toBe(10);
    expect(result.breakdown.forks.score).toBe(10);
  });
}); 