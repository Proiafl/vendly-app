// Base URL para todas las Supabase Edge Functions
export const FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;

export async function callFunction(
  name: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string;
    params?: Record<string, string>;
  } = {}
) {
  const { method = "GET", body, token, params } = options;
  const url = new URL(`${FUNCTIONS_URL}/${name}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return res;
}
