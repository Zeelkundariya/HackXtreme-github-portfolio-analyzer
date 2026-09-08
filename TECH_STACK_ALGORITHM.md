# 🧠 Tech Stack Algorithm Explained

If an interviewer asks you to walk them through your code, the `calculateTechStack` function (located in `backend/analyzer.js` from Lines 343 to 394) is the absolute best piece of code to show them. It demonstrates a strong understanding of **data structures (Sets)**, **Regular Expressions (Regex)**, and **data integrity**.

Here is the exact code and a line-by-line breakdown of how it works.

## The Code

```javascript
343: function calculateTechStack(repos) {
344:   const skills = {};
345:   const techWhitelist = [
346:     'react', 'node', 'express', 'python', 'django', 'flask', 'aws', 'docker', 'css', 'html', 'javascript', 'typescript',
347:     'vue', 'angular', 'nextjs', 'tailwindcss', 'mongodb', 'postgresql', 'vite', 'ui/ux',
348:     'sql', 'nosql', 'java', 'spring', 'kotlin', 'android', 'swift', 'ios', 'flutter', 'redux', 'graphql',
349:     'rest api', 'jest', 'cypress', 'webpack', 'babel', 'bootstrap', 'material-ui', 'shadcn', 'prisma', 'sequelize'
350:   ];
351: 
352:   repos.forEach(r => {
353:     if (r.fork) return; // Only count original repos for tech stack
354:     
355:     const repoTechs = new Set();
356:     
357:     // 1. Primary Language

358:     if (r.language) {
359:       const lang = r.language.toLowerCase();
360:       if (!['git', 'figma', 'firebase', 'github'].includes(lang)) {
361:         repoTechs.add(lang);
362:       }
363:     }
364: 
365:     // 2. GitHub Topics
366:     if (r.topics) {
367:       r.topics.forEach(t => {
368:         const topic = t.toLowerCase();
369:         if (techWhitelist.includes(topic)) {
370:           repoTechs.add(topic);
371:         }
372:       });
373:     }
374: 
375:     // 3. Smart Extraction from Name/Description
376:     const content = (r.name + " " + (r.description || "")).toLowerCase();
377:     techWhitelist.forEach(tech => {
378:       const regex = new RegExp(`\\b${tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
379:       if (regex.test(content)) {
380:         repoTechs.add(tech);
381:       }
382:     });
383:     
384:     // Add to global skills
385:     repoTechs.forEach(tech => {
386:       skills[tech] = (skills[tech] || 0) + 1;
387:     });
388:   });
389: 
390:   return Object.entries(skills)
391:     .sort((a, b) => b[1] - a[1])
392:     .slice(0, 18)
393:     .map(([name, count]) => ({ name, count }));
394: }
```

---

## The Line-by-Line Breakdown

### 1. The Setup (Lines 344 - 350)
*   **What it does:** It creates an empty `skills` object to act as our global scoreboard. Then, it creates a `techWhitelist` array containing all the valid, professional technologies we want to track.
*   **Why it’s good:** By using a whitelist, we prevent random words from being categorized as "skills". It standardizes the data we are willing to accept from the GitHub API.

### 2. The Loop & The Fork Filter (Lines 352 - 355)
*   **What it does:** It starts a loop over every single repository the user has. **Line 353** is critical: if a repository is a "fork" (cloned from someone else), the code uses `return` to skip it instantly. Then, it creates a new JavaScript `Set` called `repoTechs`. 
*   **Why it’s good:** Skipping forks ensures **data integrity**—a developer shouldn't get credit for a massive Python project if they just clicked "fork" and didn't write it. Using a `Set` is a brilliant choice because **Sets do not allow duplicates**. Even if a repository mentions "React" five times, the `Set` ensures it only counts as **1** for this specific repository.

### 3. Checking the Primary Language (Lines 357 - 363)
*   **What it does:** It checks GitHub's official "Primary Language" for the repository (like Python or JavaScript). It converts it to lowercase and adds it to our `Set`. It explicitly ignores terms like 'git' or 'github' which GitHub sometimes mistakenly labels as languages.

### 4. Checking the Topics/Tags (Lines 365 - 373)
*   **What it does:** Many developers tag their repos with topics (like `aws`, `docker`, `mongodb`). This block loops through those topics and, if the topic exists in our predefined whitelist, adds it to the `Set`.

### 5. Smart Regex Extraction (Lines 375 - 382)
*   **What it does:** Sometimes people don't use topics, but they write *"Built with React and Node"* in their repository description. This code merges the repo's name and description into one string. It then uses a **Regular Expression (Regex)** word boundary `\b` to search for our whitelisted tools. 
*   **Why it’s good:** The `\b` (boundary) is crucial! It means the word must stand alone. If we just searched for the word "react", a repo describing "reactive programming" would trigger a false positive and give the user credit for React. The regex completely prevents this bug.

### 6. Updating the Global Scoreboard (Lines 384 - 388)
*   **What it does:** Now that we have a perfectly accurate, duplicate-free `Set` of technologies for *this single repository*, we loop through them and add exactly `+1` point to the global `skills` scoreboard. 

### 7. Sorting and Formatting for the UI (Lines 390 - 394)
*   **What it does:** Finally, it converts the `skills` object into an array, sorts it from highest count to lowest count, slices off everything except the **Top 18** technologies (so the UI doesn't get cluttered), and formats it into a clean JSON array (e.g., `[{ name: 'javascript', count: 30 }]`) to send to the React frontend.
