export const demo = {
  overview: {
    topAgentsData: [
      { name: "Trade\nReviewer", value: 15600 },
      { name: "Terminal\nCopilot", value: 14200 },
      { name: "Support\nAgent", value: 9800 },
      { name: "Journal\nCoach", value: 7600 },
      { name: "Market\nContext", value: 5400 },
    ],
    systemStatus: [
      { name: "Supabase", status: "healthy" as const },
      { name: "Edge Functions", status: "healthy" as const },
      { name: "Cloudflare", status: "healthy" as const },
      { name: "WebSocket", status: "healthy" as const },
      { name: "MetaApi", status: "degraded" as const },
      { name: "Stripe", status: "healthy" as const },
      { name: "AI Provider", status: "healthy" as const },
      { name: "Cache", status: "healthy" as const },
      { name: "CDN", status: "healthy" as const },
    ],
  },
};

