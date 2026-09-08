# 🧠 The HTTP Header Trick (API Optimization)

If an interviewer asks you: **"How did you optimize your application?"** or **"How did you prevent hitting GitHub's API Rate Limits?"**, you should point them to the `fetchRepos` function in **`backend/github.js` (Lines 37 to 77)**.

This code proves you have a deep, senior-level understanding of how REST APIs work under the hood, specifically regarding **HTTP Headers** and **Pagination**.

## The Code

```javascript
37: export async function fetchRepos(username) {
38:   const res = await withRetry(() => octokit.repos.listForUser({
39:     username,
40:     per_page: 100
41:   }));
42:   const repos = res.data;
43:   
44:   const batchSize = 10;
45:   for (let i = 0; i < repos.length; i += batchSize) {
46:     const batch = repos.slice(i, i + batchSize);
47:     await Promise.allSettled(batch.map(async (repo) => {
48:       if (repo.fork) {
49:         repo.total_commits = 0;
50:         return;
51:       }
52:       try {
53:         const commitRes = await octokit.request('GET /repos/{owner}/{repo}/commits', {
54:           owner: repo.owner.login,
55:           repo: repo.name,
56:           per_page: 1
57:         });
58:         const link = commitRes.headers.link;
59:         if (link) {
60:           const match = link.match(/page=(\d+)>; rel="last"/);
61:           if (match) {
62:             repo.total_commits = parseInt(match[1], 10);
63:           } else {
64:             repo.total_commits = 1; 
65:           }
66:         } else {
67:           repo.total_commits = commitRes.data.length || 0; 
68:         }
69:       } catch (e) {
70:         repo.total_commits = 0;
71:       }
72:     }));
73:   }
74:   
75:   return repos;
76: }
```

---

## The Line-by-Line Breakdown

### 1. The Problem Statement (Why we wrote this)
By default, the GitHub `/repos` API does **not** return the total number of commits for a repository. If a repository has 5,000 commits, and you want to display that number, the standard approach is to request all commits (100 per page) and count them. That would take **50 API calls for a single repository**!
If a user has 30 repositories, calculating their commits would take 1,500 API calls, instantly exhausting GitHub's rate limit and crashing the app. 

### 2. The Asynchronous Batching (Lines 44 - 47)
*   **What it does:** Instead of resolving 30 repositories one by one (which is very slow), or all at once (which triggers GitHub's anti-spam blocks), we split the array of repositories into batches of 10. We use `Promise.allSettled` to fetch 10 at a time concurrently.
*   **Why it’s good:** This provides the perfect balance between high-speed asynchronous processing and respecting server rate limits.

### 3. The 1-Item Page Request (Lines 53 - 57)
*   **What it does:** We make an API request to the commits endpoint, but we explicitly tell GitHub: `per_page: 1`. 
*   **Why it’s good:** We don't actually care about downloading the commit data. We only want GitHub to do the math for us. Downloading 1 commit is incredibly fast and uses almost zero bandwidth.

### 4. The HTTP Link Header Hack (Lines 58 - 62)
*   **What it does:** When you ask GitHub for "Page 1" of a paginated list, GitHub includes a hidden HTTP Header called `link` in its response. This header looks like this:
    `<https://api.github.com/.../commits?per_page=1&page=2>; rel="next", <https://api.github.com/.../commits?per_page=1&page=5000>; rel="last"`
*   Our code reads the raw HTTP headers (`commitRes.headers.link`) and uses a Regex match to extract the number right next to `rel="last"`. 
*   Because we set `per_page=1`, the "last page number" is exactly equal to the **Total Number of Commits**!

### The Pitch for the Interviewer
*"To calculate the exact total commits across a user's entire portfolio, downloading the commit history would have exhausted the GitHub API rate limits immediately. Instead, I used a trick: I requested exactly 1 commit per page, and then parsed the hidden HTTP `Link` header to extract the `rel="last"` value. This allowed me to get the exact total commit count of a massive repository in just **1 single, lightweight API call**."*
