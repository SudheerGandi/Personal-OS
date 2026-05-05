
export const steps = [
  { step: 1, bucket: "Trade", source: "Reuters India, DGFT Notifications, Trading Economics", time: "5 min", lookFor: "India imports, PLI, trade deficit, import ban, DGFT notification" },
  { step: 2, bucket: "Startups", source: "Inc42, YourStory (Tue/Thu only)", time: "3 min", lookFor: "Which sectors are getting funded? Which startups shut down and why?" },
  { step: 3, bucket: "Global Deals", source: "Reuters India, LiveMint", time: "3 min", lookFor: "Foreign investment into India, M&A, companies entering/exiting Indian markets" },
  { step: 4, bucket: "AI & Tech", source: "The Rundown AI, X — AI & Tech List", time: "5 min", lookFor: "New AI capabilities, Tools creating leverage, Indian AI developments" },
  { step: 5, bucket: "Markets", source: "Moneycontrol, ET Markets", time: "4 min", lookFor: "Commodity price moves, Repo rate changes, FII flows, INR/USD" }
];

export const consultingReports = [
  { source: "McKinsey Global Institute", url: "mckinsey.com/mgi", search: ["India cold chain", "India agriculture 2024", "India manufacturing"] },
  { source: "BCG Henderson Institute", url: "bcg.com/publications", search: ["BCG India manufacturing", "BCG agritech", "BCG cold chain Asia"] },
  { source: "KPMG India", url: "home.kpmg/in", search: ["KPMG aquaculture India", "KPMG cold chain", "KPMG pharma India"] },
  { source: "EY India", url: "ey.com/en_in/insights", search: ["EY India startup ecosystem 2024", "EY India fintech"] },
  { source: "Deloitte Insights", url: "deloitte.com/insights", search: ["Deloitte India fintech", "Deloitte digital trade finance"] },
  { source: "Goldman Sachs - Briefings", url: "goldmansachs.com/intelligence", search: ["Commodity forecasts: lithium, oil, agricultural inputs"] }
];

export const tradeSearchTerms = [
  "India imports [sector]", "PLI scheme [sector]", "anti-dumping duty India",
  "DGFT notification", "India FTA [country]", "trade deficit India",
  "India [sector] imports China", "export incentive India", "import substitution India"
];

export const xLists = {
  tradeIntel: ["@dgftindia", "@CommerceIndia", "@Subhayan_M", "@JavierBlas", "@ReutersTrade", "@TradeFacilNews"],
  startups: ["@sanjay_mehta", "@nikhilkamathcio", "@anandlunia", "@paulg", "@kunal_bahl", "@Prajakt"],
  globalDeals: ["@InvestIndia", "@MEAIndia", "@dealbook", "@supplychain247", "@freightwaves", "@business"],
  aiTech: ["@karpathy", "@emollick", "@swyx", "@sarvam_ai", "@Nirant", "@clementdelangue", "@sama"],
  marketsMacro: ["@SanjeevSanyal", "@Deepakshenoy", "@JavierBlas", "@LynAldenContact", "@RBI", "@RaoulGMI"]
};

export const subreddits = [
  { name: "r/IndiaInvestments", terms: "PLI, India sector, startup", find: "Best for sector analysis, policy impact" },
  { name: "r/geopolitics", terms: "India manufacturing, China+1", find: "Why trade moves happen. India-China-US triangle" },
  { name: "r/supplychain", terms: "India, cold chain, logistics", find: "Practitioners seeing what's breaking" },
  { name: "r/Economics", terms: "India GDP, India trade", find: "Macro signals. Global trade shifts" },
  { name: "r/LocalLLaMA", terms: "AI models, open source", find: "Which AI models can run cheaply" }
];
