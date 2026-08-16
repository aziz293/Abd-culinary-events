import { createClient } from "@supabase/supabase-js";

// IMPORTANT : ce client utilise la clé "service role", qui contourne les règles
// de sécurité (RLS) de Supabase. Il ne doit JAMAIS être importé dans un composant
// client ("use client") ni exposé au navigateur — seulement dans des routes API
// et des Server Components, comme le reste de src/lib/content-store.ts.

let client: ReturnType<typeof createClient<any>> | null = null;

export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase n'est pas configuré. Ajoutez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local (voir .env.local.example)."
    );
  }

  client = createClient<any>(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
