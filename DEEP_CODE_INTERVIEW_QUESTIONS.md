# 💻 Deep Code-Based Interview Questions & Answers

If an interviewer wants to dive deep into the actual logic of your codebase to test your software engineering skills, these are the highly technical questions they will ask you, along with the exact answers you should give.

## 1. Concurrency Management
**Question:** *"When fetching commit data for 50+ repositories, how do you handle the asynchronous API requests without crashing the Node.js server or triggering GitHub's anti-abuse mechanisms?"*

> **Your Answer:** "If I used a standard `Promise.all` over 50 repositories simultaneously, GitHub's API would immediately block the IP for concurrent abuse, and the Node server might struggle with memory spikes. To solve this, I implemented an **Asynchronous Batching Mechanism** in `github.js`. I use a `for` loop to slice the repositories into batches of 10. Then, I process each batch using `Promise.allSettled`. This controls the concurrency limit perfectly. I specifically chose `Promise.allSettled` instead of `Promise.all` so that if one repository request fails (e.g., if a repo is completely empty and throws a 404), it doesn't reject the entire batch and crash the application."

## 2. Commit Classification & Heatmap Generation
**Question:** *"Your Impact Heatmap shows whether a commit was a 'feature' or 'routine' update. How do you classify commits without physically downloading and analyzing the code diffs?"*

> **Your Answer:** "Downloading code diffs would be incredibly slow and bandwidth-heavy. Instead, I analyze the **metadata** of the commits using string matching in `analyzer.js`. My algorithm scans the commit messages looking for 'Conventional Commit' prefixes. If a message starts with `feat:`, `refactor:`, or contains keywords like 'architecture' or 'module', my algorithm classifies the `type` as a `feature` day. If it just says 'update' or 'fix typo', it classifies it as `routine`. This allows me to map the developer's engineering momentum and output quality purely from API metadata in milliseconds."

## 3. Role Fit Detection Algorithm
**Question:** *"How does the system decide if a developer is a 'Frontend Engineer' versus a 'DevOps Engineer'?"*

> **Your Answer:** "In `analyzer.js`, I built a weighted keyword scoring system called `detectRoleFit`. When the application maps the tech stack, it increments specific category counters. For example, if it finds `docker`, `aws`, or `ci/cd`, it adds points to the `devops` counter. If it finds `react`, `tailwind`, or `css`, it adds points to the `frontend` counter. Whichever category accumulates the highest score dictates the primary role. I then pass this specific role into the Google Gemini AI prompt, which forces the AI to generate highly customized interview questions for that exact job title."

## 4. Prompt Engineering for AI Integration
**Question:** *"LLMs (Large Language Models) are notoriously unpredictable. How do you ensure the Google Gemini AI returns structured data that your React frontend can actually render, instead of just returning a paragraph of text?"*

> **Your Answer:** "This was a major challenge in `ai.js`. To guarantee the AI returned usable data, I used strict **Prompt Engineering**. Instead of just asking it for a review, I explicitly instructed Gemini to act as a JSON-only API. In the system prompt, I provided a strict JSON schema that it must follow (e.g., `{ "verdict": "", "traits": [], "questions": [] }`). I also wrap the raw GitHub data into a minified string payload so the AI has exact context. By enforcing this schema in the prompt, the Express backend can confidently use `JSON.parse()` on the AI's response and send it directly to the React frontend as clean state."

## 5. Graceful Error Handling
**Question:** *"What happens to your application if the GitHub API goes down, or if a user inputs an invalid username?"*

> **Your Answer:** "I designed the backend to fail gracefully. In `api.js`, all asynchronous route handlers are wrapped in `try/catch` blocks. Furthermore, in the `github.js` scraper, I implemented fallback mechanisms. If the custom HTML scraper fails to load the contribution graph (e.g., if GitHub changes their CSS classes), the `catch` block catches the error, logs a warning to the server console, and returns an empty array `[]` instead of crashing. The React frontend is designed to handle this empty array by showing a clean 'No Data Available' state rather than displaying a white screen of death."
