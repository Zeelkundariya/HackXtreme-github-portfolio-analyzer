# 🎯 Potential Interview Questions for GitHub Portfolio Analyzer

If you are presenting this project in an interview or a hackathon, here are the most likely questions judges or senior engineers will ask you, based on the exact code and architecture we have built so far.

## 🏗️ Architecture & System Design
**1. Why did you choose to separate the frontend and backend deployments?**
*Hint:* You deployed the frontend on Vercel and the backend on Render. You can explain that this allows independent scaling, keeps the API secure (hiding the GitHub and Gemini API keys on Render), and leverages Vercel's global CDN for the React UI.

**2. How are you storing the "Analytical History" and what are the limitations?**
*Hint:* You are using **SQLite**. A great technical talking point is acknowledging that because you are on Render's Free Tier (which has an ephemeral/temporary file system), the database resets when the server sleeps. Mentioning this limitation shows deep architectural awareness, and you can say your next step would be migrating to a permanent database like PostgreSQL or MongoDB.

## 🔌 API & Data Engineering (The Hard Stuff)
**3. The GitHub API limits event fetching to 300 events. How did you get the exact 30-day daily contribution graph to match real GitHub?**
*Hint:* This is a massive flex. Explain that the standard REST API wasn't enough, so you built a custom backend scraper (`fetchDailyContributions` in `github.js`) that physically reads the HTML SVG tooltips of the user's GitHub contribution calendar to get 100% accurate daily counts.

**4. How do you calculate the exact "Total Lifetime Commits" efficiently?**
*Hint:* Fetching every single commit would hit rate limits instantly. Explain the trick you used: You request just 1 commit per page (`per_page=1`) and read the `Link` header in the HTTP response to extract the `rel="last"` page number, giving you the exact total in a single API call!

**5. How did you ensure the "Tech Stack Distribution" was accurate and not polluted by cloned projects?**
*Hint:* Explain how your `calculateTechStack` algorithm works. You strictly filter out `fork: true` repositories, use `Set` data structures to ensure a technology is only counted once per repository, and use Regex boundary matching to scan descriptions intelligently.

## 🤖 AI & Logic
**6. How is the AI integrated into this project?**
*Hint:* Explain that you aren't just using AI for a chatbot. You are using Google Gemini as a reasoning engine. You feed the raw JSON data (commits, tech stack, gaps) into Gemini with a strict system prompt to make it act as a "Senior Technical Recruiter," generating tailored interview questions and a "Revival Plan" for dead projects.

**7. How does your Scoring Algorithm work?**
*Hint:* Explain that it's a weighted 100-point system. It doesn't just count stars; it evaluates "Engineering Hygiene" (like having descriptions and live demos), "Commit Discipline" (checking for Conventional Commits like `feat:` or `fix:`), and "Discoverability" (using topics). 

## 🚀 Product & Future Scope
**8. What was the absolute hardest bug or challenge you faced while building this?**
*Hint:* You can talk about the struggle of getting the frontend UI charts to exactly match GitHub's real data, or the challenge of accurately parsing multiple live demo links (like the `WEBSITE-CLONE` repo) without breaking the application.

**9. If you had 1 more month to work on this, what would you add?**
*Hint:* Good answers include: 
- Adding Redis caching so you don't hit GitHub API rate limits if many users search the same profile.
- Migrating from SQLite to PostgreSQL for persistent history graphs.
- Adding OAuth login so users can analyze their private repositories.
