import { render } from '../dist/server/entry-server.js';

export async function onRequest(context) {
  const url = context.request.url;
  const html = await render(url);
  return new Response(html, {
    headers: { 'content-type': 'text/html' }
  });
}
