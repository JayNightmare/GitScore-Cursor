/**
 * GitHub API integration
 * Handles GraphQL queries to fetch repository and user data
 */
import { graphql } from '@octokit/graphql';

const client = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

export async function fetchRepoData(owner, repo) {
  const query = `
    query($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        name
        description
        stargazerCount
        forkCount
        licenseInfo {
          name
        }
        defaultBranchRef {
          target {
            ... on Commit {
              history(first: 10) {
                nodes {
                  committedDate
                }
              }
            }
          }
        }
        object(expression: "HEAD:README.md") {
          ... on Blob {
            text
          }
        }
        workflows(first: 5) {
          nodes {
            name
            state
          }
        }
      }
    }
  `;

  try {
    const data = await client(query, { owner, repo });
    return data.repository;
  } catch (error) {
    console.error('GitHub API Error:', error);
    throw new Error('Failed to fetch repository data');
  }
} 