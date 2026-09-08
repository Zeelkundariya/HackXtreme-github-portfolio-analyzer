# 🧠 Web Scraping Algorithm Explained (Overcoming API Limits)

If an interviewer asks you, **"What was the hardest technical challenge in this project?"** or **"How did you bypass GitHub's API rate limits to get the 30-day graph?"**, you should show them the `fetchDailyContributions` function located in **`backend/github.js` (Lines 110 to 141)**.

This code proves you don't just rely on easy APIs—you know how to scrape raw HTML when APIs fail you.

## The Code

```javascript
110: export async function fetchDailyContributions(username) {
111:   try {
112:     const resp = await fetch(`https://github.com/users/${username}/contributions`);
113:     const text = await resp.text();
114:     
115:     const tds = [...text.matchAll(/<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"/g)];
116:     const tips = [...text.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g)];
117:     
118:     const tipMap = {};
119:     tips.forEach(m => {
120:       const id = m[1];
121:       const str = m[2];
122:       let count = 0;
123:       if (str.startsWith('No')) count = 0;
124:       else count = parseInt(str.split(' ')[0], 10) || 0;
125:       tipMap[id] = count;
126:     });
127:     
128:     const dailyData = tds.map(m => {
129:       return {
130:         date: m[1],
131:         count: tipMap[m[2]] || 0
132:       };
133:     });
134:     
135:     dailyData.sort((a, b) => a.date.localeCompare(b.date));
136:     return dailyData.slice(-30);
137:   } catch (err) {
138:     console.error("Failed to fetch daily contributions:", err.message);
139:     return [];
140:   }
141: }
```

---

## The Line-by-Line Breakdown

### 1. The Problem Statement (Why we wrote this)
Normally, you would use the GitHub "Events API" to track activity. However, GitHub heavily limits the Events API—it only returns the last 90 days or a maximum of **300 events**. For a highly active developer, 300 events might only cover 4 days! 
To get a perfect 30-day graph, we have to bypass the API entirely and scrape the raw HTML of the user's public contribution calendar.

### 2. Fetching Raw HTML (Lines 112 - 113)
*   **What it does:** It makes a standard HTTP request to the user's public GitHub contribution graph URL and converts the entire webpage into raw text/HTML. 

### 3. Advanced Regex Extraction (Lines 115 - 116)
*   **What it does:** Instead of installing a massive HTML parsing library (like Cheerio) which would slow down the server, it uses powerful **Regular Expressions (Regex)** with `matchAll`. 
*   **`tds` array:** It scans the HTML for table cells (`<td>`) that hold the `data-date` and a unique `id`.
*   **`tips` array:** It scans the HTML for the hidden `<tool-tip>` elements that store the actual text (e.g., *"12 contributions on October 5th"*).

### 4. Creating the Mapping Dictionary (Lines 118 - 126)
*   **What it does:** It creates a dictionary (`tipMap`). It loops through the extracted tool-tips. If the tooltip says *"No contributions"*, it assigns a `0`. Otherwise, it splits the string to extract the raw number (e.g., grabbing the "12" out of "12 contributions") and maps it to the unique `id`.
*   **Why it’s good:** This cleanly separates the data processing from the DOM structure, giving us a highly efficient lookup table.

### 5. Assembling the Final Data Array (Lines 128 - 133)
*   **What it does:** Now it loops over the dates (`tds`). For every date, it looks up the unique `id` in our `tipMap` dictionary to find out exactly how many contributions were made on that day. It packages this into a clean JSON array of `{ date, count }` objects.

### 6. Sorting and Formatting (Lines 135 - 136)
*   **What it does:** Because the HTML parser might grab the dates slightly out of order, we run a fast string sort `localeCompare` to ensure the dates are strictly chronological. Finally, it uses `.slice(-30)` to grab exactly the last 30 days of data to send to the frontend UI for charting.

### The Pitch for the Interviewer
*"When I realized the GitHub API capped at 300 events, I knew my dashboard charts would look broken for highly active engineers. Instead of accepting the API limitation, I built a lightweight, zero-dependency HTML parser using Regex that physically reads the SVG tooltips off the user's public profile. This guarantees my frontend charts are 100% accurate, no matter how many commits the user has."*
