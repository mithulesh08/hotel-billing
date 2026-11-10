export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ status: "Connected to Cloudflare Worker API" }), {
        headers: { "Content-Type": "application/json" }
      });
    }
    return env.ASSETS.fetch(request);
  },
};
