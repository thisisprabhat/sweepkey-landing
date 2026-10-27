// Static /health for previews and any host without the nginx rule. In the container, nginx answers
// /health itself (nginx.conf) and the Docker HEALTHCHECK polls it.
export const GET = () =>
  new Response(JSON.stringify({ status: 'ok', service: 'sweepkey-landing' }), {
    headers: { 'Content-Type': 'application/json' },
  });
