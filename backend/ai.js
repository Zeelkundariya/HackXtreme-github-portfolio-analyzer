import { GoogleGenerativeAI } from "@google/generative-ai";

// This function handles the core "AI Recruiter Verdict".
// It takes the compiled JSON payload (score, tech stack, gaps) from the analyzer
// and sends it to Google Gemini to generate a professional markdown assessment.
export async function getAIReview(prompt) {
    console.log("Initiating Gemini AI Audit...");
    if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_api_key_here' || !process.env.GOOGLE_API_KEY.startsWith('AIza')) {
        console.warn("Gemini API Key missing or invalid.");
        throw new Error("Missing or invalid Google AI API Key");
    }
    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        // We use gemini-1.5-flash for high speed and low latency
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log("Gemini Audit Successful.");
        return text;
    } catch (err) {
        console.error("Gemini API Error:", err.message);
        throw err;
    }
}

// The Revival Engine: This identifies "dead" or abandoned repositories
// and dynamically generates a technical roadmap to update them based on their language.
export async function getRevivalPlans(username, repos) {
    const techMissions = {
        javascript: [
            "Implement Recursive Type Definitions",
            "Add Architectural Class Diagram to README",
            "Configure Automated Documentation Pipeline",
            "Refactor to ES6+ Class Composition",
            "Implement Singleton Design Pattern for State",
            "Migration to Factory Pattern for Object Creation",
            "Add JSDoc for complex logic flows",
            "Implement Memoization for expensive calculations"
        ],
        typescript: [
            "Enable Strict Mode and resolve all 'any' types",
            "Automate API Documentation with TypeDoc",
            "Implement Unit Testing with 80% coverage",
            "Implement Utility Types for API responses",
            "Add Decorators for cross-cutting concerns",
            "Refactor to Abstract Interface patterns",
            "Setup strict TSLint rules for architecture",
            "Implement discriminated unions for state"
        ],
        python: [
            "Implement PEP8 Linting and type hinting",
            "Add Architectural Flowchart for data processing",
            "Setup Automated Pytest Pipeline",
            "Refactor to AsyncIO for I/O bound tasks",
            "Implement Decorators for logging/auth",
            "Add Pydantic models for data validation",
            "Implementation of Context Managers for resources",
            "Setup Poetry for modern dependency management"
        ],
        react: [
            "Refactor to High-Performance Composition patterns",
            "Add visual Storybook for Component isolation",
            "Optimize render performance with Memo/UseCallback",
            "Implement Custom Hooks for state separation",
            "Migration to Context API from prop drilling",
            "Add Error Boundaries for system resilience",
            "Transition to Atomic Design structure",
            "Implement HOCs for shared logic"
        ],
        docker: [
            "Optimize Layer Caching for faster deployments",
            "Implement Multi-stage builds for security",
            "Setup Automated Image Scanning",
            "Add Healthcheck probes for orchestration",
            "Minimize Image size with Alpine base",
            "Implement Secret management patterns",
            "Configure Compose for local microservices",
            "Setup Logging drivers for persistence"
        ],
        html: [
            "Refactor to Semantic HTML5 for SEO",
            "Implement Aria Roles for accessibility",
            "Add Meta tagging for Social Graph optimization",
            "Optimize asset loading with WebP/Lazy-loading",
            "Implement BEM naming for CSS sustainability",
            "Add critical path CSS for FCP speed",
            "Setup SASS/SCSS for modular styling",
            "Implement Responsive Design breakpoints"
        ]
    };

    const impactLevels = {
        low: "This upgrade will push your 'Engineering Depth' signal by +5%.",
        medium: "This upgrade will push your 'Engineering Depth' signal by +12%.",
        high: "This massive upgrade could push you into the 'Industry Authority' tier."
    };

    // Select top 3 repos by activity or stars for revival
    const candidates = repos
        .filter(r => !r.fork)
        .sort((a, b) => (b.stars * 2 + b.size / 100) - (a.stars * 2 + a.size / 100))
        .slice(0, 3);

    const plans = candidates.map((repo, index) => {
        const lang = (repo.language || "javascript").toLowerCase();
        let pool = [...(techMissions[lang] || techMissions.javascript)];

        // Better shuffle
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        const tasks = pool.slice(0, 3);

        const impactRands = ["+11%", "+13%", "+16%", "+18%", "+21%"];
        const randomImpact = impactRands[(index + repo.size) % impactRands.length];
        const missionNames = ["WEEKEND MISSION LOG", "NIGHTLY ARCHITECTURE SPRINT", "TECHNICAL DEBT CLEARANCE", "HIGH-FIDELITY REFACTOR", "SYSTEM DESIGN SPRINT", "CODE QUALITY PUSH"];
        const missionName = missionNames[(index + repo.stars) % missionNames.length];

        const impact = repo.stars > 10
            ? `Special Reward: This massive upgrade could push you into the 'Industry Authority' tier.`
            : `Impact Upgrade: This refactor will push your 'Engineering Depth' signal by ${randomImpact}.`;

        const variations = [
            `High architectural signal in ${repo.language || 'codebase'} but lacks Tier-1 documentation.`,
            `Found significant code volume (${repo.size}KB) that is currently underselling your skills.`,
            `The complexity of this module suggests missed opportunities for professional signaling.`,
            `Untapped technical authority detected in legacy components of ${repo.name}.`
        ];
        const why = variations[index % variations.length];

        return {
            repo: repo.name,
            why,
            tasks,
            bonus: impact,
            missionName // Adding missionName for frontend use
        };
    });

    // Fallback if no repos
    if (plans.length === 0) {
        plans.push({
            repo: "New Masterpiece Project",
            why: "No local assets detected for revival. Architecture simulation required.",
            tasks: ["Initialize TypeScript Monorepo", "Setup CI/CD Actions", "Draft System Design Doc"],
            bonus: impactLevels.high
        });
    }

    return { plans };
}
export async function getChatResponse(username, messages, context) {
    console.log(`Processing chat for ${username}...`);

    // Prepare the system prompt with context
    const repoContext = context.allRepos?.slice(0, 5).map(r =>
        `- ${r.name}: ${r.description} (${r.language}, ${r.stars}⭐)`
    ).join('\n');

    const systemPrompt = `
        ROLE: You are the Lead Technical Recruiter at a Tier-1 silicon valley firm. 
        SUBJECT: Technical Audit Interview for candidate "${username}".
        CORE DATA: 
        - Score: ${context.score}/100
        - Role Fit: ${context.roleFit}
        - Top Repos:
        ${repoContext}

        INSTRUCTIONS:
        - Be professional, sharp, and slightly challenging.
        - Ask specific questions about their projects/repos.
        - Don't be generic; use the candidate's real GitHub telemetry.
        INSTRUCTIONS:
        - Be professional, sharp, and slightly challenging.
        - Ask specific questions about their projects/repos.
        - Don't be generic; use the candidate's real GitHub telemetry.
        - **Provide detailed, multi-paragraph assessments (3-5 sentences per point).**
        - If they answer well, acknowledge it with technical depth. If they are vague, push for specific architectural details.
        - IMPORTANT: Your goal is to provide a high-fidelity technical audit that helps the candidate improve.
    `;

    const isValidApiKey = process.env.GOOGLE_API_KEY &&
        process.env.GOOGLE_API_KEY !== 'your_google_api_key_here' &&
        process.env.GOOGLE_API_KEY.startsWith('AIza');

    if (!isValidApiKey) {
        // High-Fidelity Detailed Fallback Logic
        const lastMsg = messages[messages.length - 1].content.toLowerCase();
        const tech = context.techStack?.[0]?.name || "modern technologies";
        const topRepo = context.allRepos?.[0]?.name || "your primary project";

        if (lastMsg.includes('hello') || lastMsg.includes('hi')) {
            return `Hello! I've been conducting a deep-dive into your GitHub profile, and your work in ${tech} stands out as a strong signal. Specifically, in ${topRepo}, I see some interesting patterns. \n\nBefore we proceed, I'd like to understand your architectural philosophy: How do you decide between a monolithic approach versus a micro-module structure when you're starting a new high-impact project like this?`;
        }
        if (lastMsg.includes('react') || lastMsg.includes('frontend')) {
            return `Interesting. Given your focus on ${tech}, how do you approach component composition and state management to ensure long-term scalability? \n\nI'm looking for details on how you handle side effects, prop drilling, and performance optimization (using Memo/UseCallback). In a production environment, how do you ensure your frontend stays performant as the data layer grows?`;
        }
        if (lastMsg.includes('api') || lastMsg.includes('backend')) {
            return `I noticed some backend patterns in your work. How do you handle high-concurrency scenarios or data consistency in your services? \n\nSpecifically, what's your strategy for error handling and logging? Beyond just status codes, how do you design your systems to be observable and easy to debug when something fails in a distributed environment?`;
        }

        return `That's an interesting technical perspective. To dig deeper into your "Engineering Depth" signal, how did you handle scalability and state management in ${topRepo}? \n\nI'm looking for Staff-level insight here—specifically, what technical trade-offs did you make during the implementation, and if you had to refactor it today for a Tier-1 production environment, what's the first thing you'd change?`;
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt
        });

        // Convert messages to Gemini history format
        const history = [];
        let foundFirstUser = false;

        for (const m of messages.slice(0, -1)) {
            if (m.role === 'user') foundFirstUser = true;
            if (foundFirstUser) {
                history.push({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }]
                });
            }
        }

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 500, // Increased for more depth
            },
        });

        const lastUserMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessage(lastUserMessage);
        const response = await result.response;
        return response.text();
    } catch (err) {
        console.error("Gemini Chat Error:", err.message);

        const lastUserMsg = messages[messages.length - 1].content.toLowerCase();
        const topRepo = (context.allRepos && context.allRepos[0]) ? context.allRepos[0].name : "your main project";

        // Deep Dynamic Fallback
        if (lastUserMsg.includes("commit") || lastUserMsg.includes("history") || lastUserMsg.includes("ghost")) {
            const discipline = context.strengths?.includes('Professional Commit Discipline') ? 'excellent' : 'developing';
            return `Looking at your GitHub telemetry, your commit patterns show ${discipline} discipline. In ${topRepo}, I see your evolution as a developer. \n\nTo reach Staff-level depth, I recommend adopting "Conventional Commits" and ensuring every PR has a technical spec. How do you currently balance your feature velocity with the need for clean, documented history?`;
        }
        if (lastUserMsg.includes("red flag") || lastUserMsg.includes("hire") || lastUserMsg.includes("senior")) {
            return `For a Senior role at a Tier-1 firm, I'm looking for architectural ownership. Your ${context.roleFit} signal is strong in ${tech}, but the "Red Flag" is the lack of documentation in your secondary repos. \n\nRecruiters want to see *why* you built something, not just the code. If I were to hire you today, how would you convince me that your codebase in ${topRepo} is production-ready and maintainable by a large team?`;
        }
        if (lastUserMsg.includes("architecture") || lastUserMsg.includes("design") || lastUserMsg.includes("pattern")) {
            return `Your work in ${topRepo} suggests you're familiar with modern patterns. However, true seniority comes from understanding the *limits* of those patterns. \n\nCan you explain a time when a specific design pattern (like Singleton or Factory) actually caused more complexity than it solved? I'm interested in your ability to choose the *right* tool for the job, not just the most popular one.`;
        }

        if (err.message.includes("API key")) {
            return `My technical assessment engine is reporting an API configuration error. However, as a Recruiter, I'm manually looking at your ${topRepo}. It shows good structural logic. \n\nCan you walk me through the most complex technical challenge you solved in that specific codebase? I'm looking for details on performance bottlenecks or edge cases you handled.`;
        }
        return `I'm seeing some structural latency in my deep-audit systems. Let's keep it high-fidelity: what's the most complex technical bug you've solved in ${topRepo}? \n\nI want to hear about your debugging process—how did you isolate the issue, what tools did you use, and how did you ensure it never happens again?`;
    }
}
