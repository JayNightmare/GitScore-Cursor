/**
 * Repository scoring logic
 * Calculates weighted scores based on various repository metrics
 */

const WEIGHTS = {
  README: 2.0,
  LICENSE: 1.5,
  STARS: 1.0,
  FORKS: 0.8,
  RECENT_COMMITS: 1.2,
  CI_WORKFLOWS: 1.5,
};

export function calculateScore(repoData) {
  const breakdown = {};
  let totalScore = 0;
  let maxPossibleScore = 0;

  // README Score
  const hasReadme = !!repoData.object?.text;
  breakdown.readme = {
    score: hasReadme ? 10 : 0,
    weight: WEIGHTS.README,
    weightedScore: hasReadme ? 10 * WEIGHTS.README : 0,
  };

  // License Score
  const hasLicense = !!repoData.licenseInfo?.name;
  breakdown.license = {
    score: hasLicense ? 10 : 0,
    weight: WEIGHTS.LICENSE,
    weightedScore: hasLicense ? 10 * WEIGHTS.LICENSE : 0,
  };

  // Stars Score (normalized to 0-10)
  const starsScore = Math.min(repoData.stargazerCount / 100, 10);
  breakdown.stars = {
    score: starsScore,
    weight: WEIGHTS.STARS,
    weightedScore: starsScore * WEIGHTS.STARS,
  };

  // Forks Score (normalized to 0-10)
  const forksScore = Math.min(repoData.forkCount / 50, 10);
  breakdown.forks = {
    score: forksScore,
    weight: WEIGHTS.FORKS,
    weightedScore: forksScore * WEIGHTS.FORKS,
  };

  // Recent Commits Score
  const commits = repoData.defaultBranchRef?.target?.history?.nodes || [];
  const recentCommits = commits.filter(commit => {
    const commitDate = new Date(commit.committedDate);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return commitDate > thirtyDaysAgo;
  }).length;
  
  const commitsScore = Math.min(recentCommits, 10);
  breakdown.recentCommits = {
    score: commitsScore,
    weight: WEIGHTS.RECENT_COMMITS,
    weightedScore: commitsScore * WEIGHTS.RECENT_COMMITS,
  };

  // CI Workflows Score
  const workflows = repoData.workflows?.nodes || [];
  const activeWorkflows = workflows.filter(w => w.state === 'ACTIVE').length;
  const workflowsScore = Math.min(activeWorkflows * 2, 10);
  breakdown.ciWorkflows = {
    score: workflowsScore,
    weight: WEIGHTS.CI_WORKFLOWS,
    weightedScore: workflowsScore * WEIGHTS.CI_WORKFLOWS,
  };

  // Calculate total weighted score
  Object.values(breakdown).forEach(metric => {
    totalScore += metric.weightedScore;
    maxPossibleScore += 10 * metric.weight;
  });

  // Normalize final score to 0-10
  const finalScore = (totalScore / maxPossibleScore) * 10;

  return {
    score: Number(finalScore.toFixed(1)),
    breakdown,
  };
} 