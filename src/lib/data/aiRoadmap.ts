import { AIWeek } from '../../types';

export const aiRoadmap: AIWeek[] = [
  {
    week: 1,
    phase: "P1 Foundations",
    title: "Python — From Zero to Fluent",
    summary: "No shortcuts. The language behind every AI backend you will build.",
    objectives: [
      "Variables, data types, control flow, functions, loops",
      "Lists, dicts, tuples, sets — mutability",
      "OOP in depth: classes, inheritance, composition, dunder methods",
      "Error handling: try/except/finally",
      "File I/O, modules, pip, virtual environments",
      "Decorators and closures"
    ],
    resources: [
      { type: "course", name: "100 Days of Code — Angela Yu", why: "Days 1–15: basics, OOP, error handling, file I/O", url: "udemy.com", hrs: "25hrs" },
      { type: "free", name: "Real Python — Python Basics Series", why: "Best supplementary reading for concepts", url: "realpython.com/start-here", hrs: "8hrs" },
      { type: "docs", name: "Python Official Tutorial", why: "Source of truth. Read alongside the course.", url: "docs.python.org/3/tutorial", hrs: "5hrs" }
    ],
    project: {
      title: "15 Python Scripts — Real Problems Only",
      description: "One script per concept: file organiser, web scraper, CLI quiz app, password generator.",
      tags: ["Python", "OOP", "File I/O", "CLI tools", "GitHub: 15 commits"]
    },
    checks: [
      "Write a class with inheritance and explain composition",
      "Write a decorator that logs function call time",
      "All 15 scripts on GitHub with READMEs"
    ]
  },
  {
    week: 2,
    phase: "P1 Foundations",
    title: "Python Advanced — Async, Testing, Type Hints",
    summary: "The specific Python that production AI engineering uses every day.",
    objectives: [
      "async/await, event loop",
      "Type hints (Pydantic, FastAPI)",
      "pytest: write tests for critical paths",
      "Pydantic v2: data models and validation",
      "Regular expressions and web scraping depth"
    ],
    resources: [
      { type: "free", name: "Real Python — Async IO in Python", why: "Clearest explanation of async/await", url: "realpython.com/async-io-python", hrs: "3hrs" },
      { type: "docs", name: "Pydantic v2 Docs", why: "Pydantic is the data layer under FastAPI", url: "docs.pydantic.dev", hrs: "4hrs" },
      { type: "docs", name: "pytest Docs — Getting Started", why: "Write tests for everything from now on.", url: "docs.pytest.org", hrs: "3hrs" }
    ],
    project: {
      title: "Async Document Processor with Tests",
      description: "Async Python script to clean PDF text and save to structured JSON with full test suite.",
      tags: ["Async", "Pydantic", "pytest", "pdfplumber"]
    },
    checks: [
      "Explain event loop and async function calls",
      "All 6 pytest tests pass including error cases",
      "Explain Pydantic validation vs plain dict"
    ]
  },
  {
    week: 3,
    phase: "P1 Foundations",
    title: "JavaScript ES6 + React",
    summary: "Modern JS only. Then React — the UI layer everything else is built on.",
    objectives: [
      "ES6+ syntax (arrow functions, restructuring, etc.)",
      "Async JS: Promises, async/await, fetch API",
      "React function components, props, useState, useEffect",
      "Data fetching: loading, error, empty states"
    ],
    resources: [
      { type: "free", name: "javascript.info", why: "The single best free JS resource", url: "javascript.info", hrs: "18hrs" },
      { type: "docs", name: "react.dev/learn", why: "The new official React docs (2024)", url: "react.dev/learn", hrs: "12hrs" }
    ],
    project: {
      title: "CivilMind UI Shell — React",
      description: "Build the static UI shell of CivilMind: search bar, result cards, loading skeleton.",
      tags: ["React", "useState", "useEffect", "Vercel"]
    },
    checks: [
      "Write a component that fetches from an API with 3 states",
      "Explain why useEffect with no dependency array is dangerous",
      "CivilMind shell has all three states without crashing"
    ]
  },
  {
    week: 4,
    phase: "P2 Backend Engineering",
    title: "HTTP Deep + REST API Design + FastAPI",
    summary: "How the web actually works, then how to build APIs properly.",
    objectives: [
      "HTTP fundamentals: lifecycle, methods, headers, status codes",
      "REST API design: naming, versioning, pagination",
      "Consistent response shape: {data, error, meta}",
      "FastAPI routers, dependency injection, middleware",
      "API testing with HTTPie and pytest + httpx",
      "CORS configuration"
    ],
    resources: [
      { type: "free", name: "MDN — HTTP Overview", why: "Source of truth for web protocols", url: "developer.mozilla.org", hrs: "3hrs" },
      { type: "docs", name: "FastAPI Docs — Bigger Applications", why: "Structuring production FastAPI apps", url: "fastapi.tiangolo.com", hrs: "8hrs" },
      { type: "free", name: "REST API Best Practices", why: "Clear, practical REST design guide", url: "freecodecamp.org", hrs: "2hrs" }
    ],
    project: {
      title: "Versioned REST API — /v1/contracts",
      description: "Build a production-ready contract management API with versioning, pagination, and tests.",
      tags: ["FastAPI", "REST", "/v1/", "Render"]
    },
    checks: [
      "Explain the difference between PUT and PATCH",
      "API returns 404 correctly for non-existent IDs",
      "10 pytest tests pass including pagination"
    ]
  },
  {
    week: 5,
    phase: "P2 Backend Engineering",
    title: "SQL + PostgreSQL + Database Design",
    summary: "Schema design, indexes, and queries that clients' systems actually need.",
    objectives: [
      "Relational DB design: entities, relationships, keys",
      "Normalisation: 1NF, 2NF, 3NF theory",
      "SQL depth: JOINs, GROUP BY, aggregations, CTEs",
      "Indexes: B-tree, performance trade-offs",
      "Transactions: ACID properties, BEGIN/COMMIT/ROLLBACK",
      "Prisma ORM with PostgreSQL"
    ],
    resources: [
      { type: "free", name: "PostgreSQL Tutorial", why: "The best free PostgreSQL guide", url: "postgresqltutorial.com", hrs: "15hrs" },
      { type: "docs", name: "Prisma Docs", why: "Modern ORM for PostgreSQL", url: "prisma.io/docs", hrs: "6hrs" }
    ],
    project: {
      title: "CivilMind Database Schema",
      description: "Design and implement the full relational schema for CivilMind with Prisma.",
      tags: ["PostgreSQL", "Prisma", "Relational Design", "Migrations"]
    },
    checks: [
      "Write a complex JOIN query raw without ORM",
      "Explain why adding an index speeds up specific lookups",
      "Demonstrate a failing transaction rolling back correctly"
    ]
  },
  {
    week: 6,
    phase: "P2 Backend Engineering",
    title: "Authentication + Middleware + Error Handling",
    summary: "Understand auth from first principles, then use libraries confidently.",
    objectives: [
      "JWT (JSON Web Tokens) internals and signing",
      "Auth flows: Signup → Hash → Login → Sign → Verify",
      "FastAPI auth middleware with dependency injection",
      "OAuth2 with Google integration",
      "Request logging and global error handling middleware",
      "Supabase Auth integration"
    ],
    resources: [
      { type: "free", name: "JWT.io Introduction", why: "Official JWT foundation", url: "jwt.io", hrs: "2hrs" },
      { type: "docs", name: "FastAPI — Security guide", why: "Build auth from scratch first", url: "fastapi.tiangolo.com", hrs: "6hrs" },
      { type: "docs", name: "Supabase Auth — Next.js", why: "Hosted auth implementation", url: "supabase.com", hrs: "3hrs" }
    ],
    project: {
      title: "Auth System from Scratch + Supabase",
      description: "Build internal JWT auth and then migrate to Supabase for the full experience.",
      tags: ["JWT", "bcrypt", "Middleware", "Supabase"]
    },
    checks: [
      "Explain the three parts of a JWT",
      "Logging middleware captures user IDs on auth requests",
      "Global error handler prevents leak of stack traces"
    ]
  },
  {
    week: 7,
    phase: "P2 Backend Engineering",
    title: "Redis + Background Tasks + File Uploads",
    summary: "Three things that appear in every real client project.",
    objectives: [
      "Redis: in-memory caching and rate limiting",
      "Caching strategies: cache-aside and invalidation",
      "Background tasks for long-running document processing",
      "File uploads: multipart/form-data and storage",
      "WebSockets/SSE for real-time updates"
    ],
    resources: [
      { type: "docs", name: "Redis Docs for Python", why: "Official Redis guide", url: "redis.io/docs", hrs: "4hrs" },
      { type: "docs", name: "FastAPI — Background Tasks", why: "Essential for processing large PDFs", url: "fastapi.tiangolo.com", hrs: "3hrs" },
      { type: "free", name: "Real Python — Redis + Python", why: "Practical caching patterns", url: "realpython.com", hrs: "4hrs" }
    ],
    project: {
      title: "CivilMind Processing Pipeline",
      description: "Doc upload (S3/Disk) + Background extraction + Redis rate limiting.",
      tags: ["Redis", "BackgroundTasks", "FileIO", "202 Pattern"]
    },
    checks: [
      "Endpoint returns 202 immediately and processes in background",
      "Redis caching reducing DB queries effectively",
      "Rate limiting blocking excessive uploads"
    ]
  },
  {
    week: 8,
    phase: "P3 Frontend",
    title: "Next.js + Tailwind + Full-Stack Integration",
    summary: "Connect your Real Backend to a production-grade Frontend.",
    objectives: [
      "Next.js App Router mental model (Server vs Client)",
      "Tailwind CSS 8-point spacing and typography",
      "Auth integration: handling JWT in cookies",
      "Streaming responses with Server-Sent Events (SSE)",
      "Environment variable security"
    ],
    resources: [
      { type: "docs", name: "Next.js Learn Course", why: "The absolute best way to learn Next.js", url: "nextjs.org/learn", hrs: "10hrs" },
      { type: "docs", name: "Tailwind CSS Docs", why: "Responsive design foundations", url: "tailwindcss.com", hrs: "4hrs" }
    ],
    project: {
      title: "CivilMind v0 — Full Stack Live",
      description: "Connect your React shell to Next.js and your FastAPI backend. Live end-to-end.",
      tags: ["Next.js", "Tailwind", "FullStack", "Vercel"]
    },
    checks: [
      "Login persists across page refreshes",
      "Unauth requests redirect to login correctly",
      "Upload pipeline works end-to-end in cloud"
    ]
  },
  {
    week: 9,
    phase: "P4 LLM + RAG",
    title: "LLM APIs — Streaming, Functions, Cost",
    summary: "The core primitives. Learn these before touching any framework.",
    objectives: [
      "OpenAI & Anthropic APIs: tokens, context, pricing",
      "UX: word-by-word streaming with SSE",
      "System Prompting and constraints",
      "Function Calling / Tool Use orchestration",
      "Token usage and cost tracking"
    ],
    resources: [
      { type: "free", name: "ChatGPT API for Developers", why: "Andrew Ng's classic intro", url: "deeplearning.ai", hrs: "4hrs" },
      { type: "docs", name: "OpenAI Cookbook", why: "The bible of LLM implementations", url: "github.com/openai", hrs: "6hrs" }
    ],
    project: {
      title: "LLM Integration Layer",
      description: "Add /chat (streaming), /extract (functions), and /usage to CivilMind.",
      tags: ["OpenAI", "Anthropic", "SSE", "CostTracking"]
    },
    checks: [
      "Chat endpoint streams tokens visibly",
      "Function calling extracts 100% accurate JSON",
      "Cost report visible for every user request"
    ]
  },
  {
    week: 10,
    phase: "P4 LLM + RAG",
    title: "Embeddings + Vector Databases",
    summary: "How AI searches meaning. The retrieval layer under every RAG system.",
    objectives: [
      "Embeddings: high-dimensional math for text similarity",
      "Cosine similarity vs Euclidean distance",
      "Qdrant: Production vector DB setup and search",
      "Metadata filtering for tenant isolation",
      "Document ingestion: chunking and embedding strategies"
    ],
    resources: [
      { type: "free", name: "Building Systems with ChatGPT", why: "Best intro to embeddings", url: "deeplearning.ai", hrs: "4hrs" },
      { type: "docs", name: "Qdrant Quick Start", why: "Use a production DB, not a toy", url: "qdrant.tech", hrs: "6hrs" }
    ],
    project: {
      title: "Tenant-Isolated Index",
      description: "Ingest CivilMind docs into Qdrant with strict user_id/project_id isolation.",
      tags: ["Qdrant", "Embeddings", "Isolation", "MultiTenant"]
    },
    checks: [
      "Search results NEVER leak across project IDs",
      "Ingestion pipeline is idempotent (no duplicates)",
      "Explain HNSW pros/cons briefly"
    ]
  },
  {
    week: 11,
    phase: "P4 LLM + RAG",
    title: "RAG Pipeline — End to End",
    summary: "Retrieval Augmented Generation. The most-sold AI service in 2026.",
    objectives: [
      "The full RAG loop: Retrieve → Build → Prompt → Gen → Cite",
      "LangChain LCEL (Expression Language) foundations",
      "RAG Prompt Design: source grounding and safety",
      "RAGAS evaluation: Faithfulness, Relevancy, Precision",
      "Common failure modes and how to address them"
    ],
    resources: [
      { type: "free", name: "LangChain: Chat with Your Data", why: "Official course by LangChain team", url: "deeplearning.ai", hrs: "3hrs" },
      { type: "docs", name: "RAGAS Quickstart", why: "Set your quality baseline early", url: "docs.ragas.io", hrs: "3hrs" }
    ],
    project: {
      title: "CivilMind v1 — RAG with Citations",
      description: "Working RAG with doc/page citations + RAGAS evaluation suite.",
      tags: ["LangChain", "RAGAS", "Citations", "Postgres"]
    },
    checks: [
      "RAGAS faithfulness score above 0.65",
      "Citations show exact document and page source",
      "Queries permanently stored in Postgres"
    ]
  },
  {
    week: 12,
    phase: "P4 LLM + RAG",
    title: "Advanced RAG — Hybrid + Re-ranking",
    summary: "The gap between demo and production. Move to 95% accuracy.",
    objectives: [
      "Hybrid Search: BM25 (keyword) + Vector merging (RRF)",
      "Re-ranking with Cohere Rerank model",
      "Contextual Retrieval patterns by Anthropic",
      "Query Expansion and Multi-query retrievers",
      "Handling tabular data within RAG contexts"
    ],
    resources: [
      { type: "free", name: "Anthropic: Contextual Retrieval", why: "Advanced doc-level context pattern", url: "anthropic.com/blog", hrs: "2hrs" },
      { type: "docs", name: "Cohere Rerank Guide", why: "Essential for precision", url: "docs.cohere.com", hrs: "2hrs" }
    ],
    project: {
      title: "CivilMind v1.5 — Hybrid RAG",
      description: "Upgrade retrieval to Hybrid + Re-ranking and document the RAGAS improvement.",
      tags: ["HybridSearch", "Rerank", "Precision", "CaseStudy"]
    },
    checks: [
      "Hybrid search solves the 'IS Code' lookup problem",
      "RAGAS accuracy improvement documented in README",
      "Drafted one 'Why Hybrid RAG' pitch for clients"
    ]
  },
  {
    week: 13,
    phase: "P5 AI System Design",
    title: "AI System Design — Architecture and Scale",
    summary: "How to design production AI systems end to end.",
    objectives: [
      "Scale: defining requirements and choosing components",
      "Horizontal vs Vertical scaling for AI backends",
      "Deep multi-tenancy at the data layer",
      "Async AI pipelines: why the 202 pattern is the only way",
      "Cost optimization: caching and model routing",
      "Fallbacks and high availability"
    ],
    resources: [
      { type: "free", name: "ByteByteGo System Design", why: "Foundational visual design learning", url: "youtube.com", hrs: "4hrs" },
      { type: "free", name: "Chip Huyen — AI Engineering", why: "Modern AI specific architecture", url: "huyenchip.com", hrs: "3hrs" }
    ],
    project: {
      title: "CivilMind Architecture Doc",
      description: "Write a 2-page system design document with diagrams for CivilMind scaling.",
      tags: ["SysDesign", "Architecture", "Diagramming", "Scale"]
    },
    checks: [
      "Diagram shows full async data flow correctly",
      "Cost strategy handles 10,000 users/day logic",
      "Isolation mechanism clearly defined"
    ]
  },
  {
    week: 14,
    phase: "P6 Advanced AI",
    title: "LangGraph — Agents and State Machines",
    summary: "Critical Skill #1: System Design applied to agents.",
    objectives: [
      "ReAct loop theory: Thought, Action, Observation",
      "LangGraph: nodes, edges, and conditional routing",
      "Tool binding and argument validation",
      "Agent memory: context-size vs external storage",
      "Human-in-the-loop workflows"
    ],
    resources: [
      { type: "free", name: "AI Agents in LangGraph", why: "Andrew Ng + LangChain course", url: "deeplearning.ai", hrs: "4hrs" },
      { type: "docs", name: "LangGraph Tutorials", why: "Mastering state machine agents", url: "langchain-ai.github.io", hrs: "8hrs" }
    ],
    project: {
      title: "Contract Analyzer Agent",
      description: "Build an agent with specialized tools for risk, clause, and compliance detection.",
      tags: ["LangGraph", "Agents", "StateMachines", "HITL"]
    },
    checks: [
      "Agent uses correct tools autonomously for multi-step queries",
      "Human-in-the-loop triggers for high-risk flags",
      "Explain why state machines > simple chains"
    ]
  },
  {
    week: 15,
    phase: "P6 Advanced AI",
    title: "CrewAI + MCP — Multi-Agent + Protocol",
    summary: "Multiple specialists + the standard for agent integration.",
    objectives: [
      "CrewAI: Role-playing, backstories, and goal-driven agents",
      "Sequential vs Hierarchical crews",
      "MCP (Model Context Protocol) standard",
      "Building MCP servers in Python",
      "Connecting local toolsets to Claude Desktop"
    ],
    resources: [
      { type: "docs", name: "CrewAI Quickstart", why: "Multi-agent systems basics", url: "docs.crewai.com", hrs: "5hrs" },
      { type: "docs", name: "MCP Standard", why: "Anthropic's new connectivity standard", url: "modelcontextprotocol.io", hrs: "5hrs" }
    ],
    project: {
      title: "CivilMind Crew + MCP Server",
      description: "Multi-agent research crew + an MCP server exposing your tools to Claude.",
      tags: ["CrewAI", "MCP", "ClaudeDesktop", "Integration"]
    },
    checks: [
      "Crew produces a synth report from 4 agents",
      "MCP tools appear in Claude Desktop local test",
      "Pitch MCP server build as a standalone service"
    ]
  },
  {
    week: 16,
    phase: "P6 Advanced AI",
    title: "PydanticAI + Reliability Engineering",
    summary: "Critical Skills #2 and #4. Type-safe tools. Failure-proof systems.",
    objectives: [
      "Strict tool schemas with Pydantic Field descriptions",
      "PydanticAI agent definitions",
      "Reliability patterns: Exponential backoff and retries",
      "Circuit breakers to protect system health",
      "Timeouts and graceful fallbacks"
    ],
    resources: [
      { type: "docs", name: "PydanticAI Documentation", why: "Type-safe AGents", url: "ai.pydantic.dev", hrs: "5hrs" },
      { type: "docs", name: "Tenacity Library", why: "Standard for retries", url: "tenacity.readthedocs.io", hrs: "2hrs" }
    ],
    project: {
      title: "Hardened CivilMind Refactor",
      description: "Refactor CivilMind with PydanticAI and full reliability engineering (Circuit Breakers/Retries).",
      tags: ["Reliability", "PydanticAI", "Tenacity", "ErrorHandling"]
    },
    checks: [
      "All tool schemas have complete types and examples",
      "Retry handles 429 rate limits without crashing app",
      "Documented a scenario where retry saved a request"
    ]
  },
  {
    week: 17,
    phase: "P6 Advanced AI",
    title: "Docker + CI/CD + GitHub Actions",
    summary: "Infrastructure that makes every project trustworthy.",
    objectives: [
      "Dockerization: images, containers, volumes",
      "Docker-compose for full-stack local dev",
      "CI/CD: Automating RAGAS evaluations on PRs",
      "Block merges based on quality regressions",
      "Structured JSON logging with correlation IDs"
    ],
    resources: [
      { type: "yt", name: "TechWorld with Nana — Docker", why: "Highest quality Docker intro", url: "youtube.com", hrs: "4hrs" },
      { type: "docs", name: "GitHub Actions Guide", why: "Automating development pipelines", url: "github.com", hrs: "4hrs" }
    ],
    project: {
      title: "CivilMind Full Infrastructure",
      description: "Dockerize the complete stack and add an automated RAGAS quality gate to GitHub.",
      tags: ["Docker", "GithubActions", "CI/CD", "QualityGate"]
    },
    checks: [
      "One command (docker-compose up) starts 4+ services",
      "PR fails if RAGAS score drops below threshold",
      "Logs easily searchable via correlation IDs"
    ]
  },
  {
    week: 18,
    phase: "P6 Advanced AI",
    title: "Security + LangSmith + Observability",
    summary: "Critical Skills #5 and #6. You cannot fix what you cannot see.",
    objectives: [
      "OWASP LLM Top 10 risks: Injection, Data exfil, etc.",
      "PII detection with Presidio for construction docs",
      "LangSmith tracing for root-cause analysis",
      "Observing agent reasoning chains visibly",
      "Automated prompt testing with promptfoo"
    ],
    resources: [
      { type: "free", name: "OWASP LLM Top 10", why: "Essential security baseline", url: "owasp.org", hrs: "2hrs" },
      { type: "docs", name: "LangSmith Tracing", why: "Critical for debugging production AI", url: "docs.smith.langchain.com", hrs: "5hrs" }
    ],
    project: {
      title: "Security Scanner & Observability",
      description: "Add PII detection and full LangSmith tracing. Build an OWASP risk auditor tool.",
      tags: ["Security", "Observability", "OWASP", "PII"]
    },
    checks: [
      "Presidio correctly flags PII in test inputs",
      "Failed RAG query traced to root cause in LangSmith",
      "Promptfoo regression test suite running"
    ]
  },
  {
    week: 19,
    phase: "P6 Advanced AI",
    title: "DSPy — Systematic Prompt Optimisation",
    summary: "What senior AI engineers do. Stop guessing prompts.",
    objectives: [
      "DSPy programs: Signatures > Hand-crafted prompts",
      "BootstrappedFewShot optimiser implementation",
      "Optimising complex programs over large datasets",
      "Benchmarking DSPy against your manual prompt baseline"
    ],
    resources: [
      { type: "docs", name: "DSPy Official Docs", why: "Stop manual prompt engineering", url: "dspy.ai", hrs: "6hrs" },
      { type: "gh", name: "Stanford NLP — DSPy", why: "Working examples for RAG", url: "github.com/stanfordnlp", hrs: "4hrs" }
    ],
    project: {
      title: "DSPy-Optimised CivilMind",
      description: "Replace CivilMind RAG with a DSPy program and measure the RAGAS improvement.",
      tags: ["DSPy", "Optimization", "RAGAS", "CaseStudy"]
    },
    checks: [
      "DSPy outperformed manual prompt in RAGAS",
      "Explain how optimisers find better few-shot examples",
      "Case study post published on Medium"
    ]
  },
  {
    week: 20,
    phase: "P6 Advanced AI",
    title: "n8n + AWS Lambda + Amazon Bedrock",
    summary: "Automation clients + cloud clients. Two revenue streams.",
    objectives: [
      "n8n visual workflows for AI triage and email",
      "AWS Lambda with Mangum for serverless FastAPI",
      "Amazon Bedrock: Enterprise-grade LLM provider",
      "S3 storage for large production docs",
      "Cloud-native architecture patterns"
    ],
    resources: [
      { type: "docs", name: "n8n Quickstart", why: "Winning automation clients", url: "docs.n8n.io", hrs: "6hrs" },
      { type: "docs", name: "AWS Lambda — Mangum", why: "Serverless AI backends", url: "aws.amazon.com", hrs: "4hrs" }
    ],
    project: {
      title: "n8n Automation + AWS Deployment",
      description: "Build an AI email triage workflow and deploy CivilMind serverless to AWS.",
      tags: ["n8n", "AWS", "Lambda", "Bedrock"]
    },
    checks: [
      "n8n workflow runs trigger-to-email end-to-end",
      "Lambda handle full RAG request successfully",
      "Explain ROI of n8n automation to a non-tech client"
    ]
  },
  {
    week: 21,
    phase: "P7 Capstone + ₹",
    title: "CivilMind 2.0 — Production Launch",
    summary: "Everything you built. One product. Ship it.",
    objectives: [
      "Advanced streaming UI in Next.js",
      "User-trust design and uncertainty handling",
      "ML for tabular data: XGBoost integration",
      "Technical writing: the Capstone Case Study",
      "Optimizing for 100% production readiness"
    ],
    resources: [
      { type: "yt", name: "StatQuest — XGBoost", why: "Best ML intuition for tables", url: "youtube.com", hrs: "4hrs" }
    ],
    project: {
      title: "FINAL CAPSTONE RELEASE",
      description: "CivilMind 2.0: Full agentic, secure, observable RAG system. Live and public.",
      tags: ["Capstone", "Production", "FinalLaunch"]
    },
    checks: [
      "All 26 weeks combined into one primary proof-of-work",
      "Public Medium post published with architecture breakdown",
      "Loom demo recorded for top of dashboard"
    ]
  },
  {
    week: 22,
    phase: "P7 Capstone + ₹",
    title: "Portfolio Polish + Service Packaging",
    summary: "Before selling, package what you are selling.",
    objectives: [
      "GitHub README optimization for hiring",
      "Loom demos: 2-minute project walkthroughs",
      "Defining your 3 Service Packages (RAG, Agents, Security)",
      "LinkedIn and Upwork profile engineering",
      "The 'Pitch' — practice in the mirror"
    ],
    resources: [
      { type: "free", name: "Loom walkthroughs guide", why: "Show don't tell", url: "loom.com", hrs: "3hrs" }
    ],
    project: {
      title: "Portfolio Site & Service Deck",
      description: "GitHub Pages portfolio + the 3 specific AI services you sell for $2000+ each.",
      tags: ["Portfolio", "Sales", "Services", "Freelance"]
    },
    checks: [
      "3 projects have Loom demos + READMEs",
      "Upwork/LinkedIn niche clearly defined",
      "Comfortable pitching $2500 fixed price"
    ]
  },
  {
    week: 23,
    phase: "P7 Capstone + ₹",
    title: "Outreach — First 200 Messages",
    summary: "Money does not come. You go get it.",
    objectives: [
      "High-signal Cold DM formula",
      "Targeting decision makers at AEC firms (US/UK)",
      "Upwork proposal strategy (The Paragraph)",
      "Lead generation and response tracking",
      "Handling rejection and pivoting outreach hooks"
    ],
    resources: [
      { type: "free", name: "YC Work at a Startup", why: "Tier 1 AI jobs", url: "workatastartup.com", hrs: "ongoing" }
    ],
    project: {
      title: "The 200 Message Campaign",
      description: "Send 200 LinkedIn DMs + 20 Upwork proposals and track in CRM.",
      tags: ["Outreach", "Sales", "LeadGen", "Execution"]
    },
    checks: [
      "Sent 200 targeted messages",
      "Diagnosis run after first 50 for no-responses",
      "First lead conversation scheduled"
    ]
  },
  {
    week: 24,
    phase: "P7 Capstone + ₹",
    title: "Close + Deliver + Invoice",
    summary: "First money received. Then do it again, faster.",
    objectives: [
      "Crafting the project proposal and scope",
      "Wise payment setup for international clients",
      "Weekly delivery rhythm and client reporting",
      "Invoicing and testimonial collection",
      "Rate raising after proof of delivery"
    ],
    resources: [
      { type: "free", name: "Wise International Payments", why: "Best for Indian freelancers", url: "wise.com", hrs: "1hr" }
    ],
    project: {
      title: "First Paid Delivery + Testimonial",
      description: "Close first client, deliver high-quality work, and get the testimonial.",
      tags: ["Revenue", "Invoicing", "Testimonial", "Delivery"]
    },
    checks: [
      "First invoice paid correctly",
      "Written/Video testimonial collected",
      "Post-mortem doc written for process improvement"
    ]
  },
  {
    week: 25,
    phase: "P8 Mastery & Career",
    title: "The AI Freelancer/Founder Playbook",
    summary: "Closing the gap between engineering and earnings.",
    objectives: [
      "Pricing AI projects (fixed vs monthly retainer)",
      "Selling 'efficiency' to non-technical business owners",
      "Building a personal brand as an AI Engineer",
      "Case study: Closing a ₹5L+ project"
    ],
    resources: [
      { type: "free", name: "The Pragmatic Freelancer", why: "High value consulting tips", url: "youtube.com", hrs: "4hrs" },
      { type: "book", name: "Million Dollar Consulting", why: "Alan Weiss strategy", url: "amazon.com", hrs: "10hrs" }
    ],
    project: {
      title: "Client Pitch Deck & Prototype",
      description: "A complete professional proposal and working prototype for a specific business problem.",
      tags: ["Business", "Sales", "Strategy"]
    },
    checks: [
      "Articulate the ROI of your AI solution in under 2 minutes",
      "Draft a professional services agreement for an AI project"
    ]
  },
  {
    week: 26,
    phase: "P8 Mastery & Career",
    title: "Capstone Project Launch",
    summary: "The final rep. Building something you are proud to show the world.",
    objectives: [
      "Product-Market Fit for AI products",
      "User testing and iteration",
      "Final polishing and optimization",
      "Launch strategy (X, LinkedIn, Product Hunt)"
    ],
    resources: [
      { type: "free", name: "How to Launch on Product Hunt", why: "The ultimate guide", url: "producthunt.com", hrs: "2hrs" },
      { type: "free", name: "Y Combinator Startup School", why: "Scaling foundations", url: "startupschool.org", hrs: "20hrs" }
    ],
    project: {
      title: "FINAL CAPSTONE PROJECT",
      description: "A complete AI-driven product that solves a real-world problem, with users/traction.",
      tags: ["Launch", "Scale", "Business"]
    },
    checks: [
      "The project is deployed, functional, and has a professional landing page",
      "You have shared the project with 5 potential users for feedback"
    ]
  }
];
