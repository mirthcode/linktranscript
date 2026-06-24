import { config } from "@/lib/config";

/**
 * Thin fetch wrapper that:
 *  - sends a realistic desktop User-Agent (YouTube serves different markup otherwise)
 *  - optionally routes through a proxy (helps when cloud/server IPs are blocked)
 *
 * The proxy is applied via Node's global undici dispatcher only when configured,
 * so local development needs no proxy at all.
 */

const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

let dispatcherReady = false;

async function ensureProxyDispatcher() {
  if (dispatcherReady || !config.youtube.proxyUrl) return;
  try {
    // Lazy import so the app works without undici proxy support installed.
    // Variable specifier keeps TS from trying to resolve the (Node built-in) module.
    const moduleName = "undici";
    const undici = (await import(moduleName)) as unknown as {
      ProxyAgent: new (uri: string) => unknown;
      setGlobalDispatcher: (d: unknown) => void;
    };
    const { ProxyAgent, setGlobalDispatcher } = undici;
    setGlobalDispatcher(new ProxyAgent(config.youtube.proxyUrl));
    dispatcherReady = true;
  } catch {
    // Proxy not available — continue with direct fetch.
  }
}

export async function ytFetch(
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  await ensureProxyDispatcher();
  const headers = new Headers(init.headers);
  if (!headers.has("User-Agent")) headers.set("User-Agent", DESKTOP_UA);
  if (!headers.has("Accept-Language"))
    headers.set("Accept-Language", "en-US,en;q=0.9");
  return fetch(url, {
    ...init,
    headers,
    // Never cache YouTube responses at the fetch layer.
    cache: "no-store",
  });
}
