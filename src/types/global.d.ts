declare global {
  interface Window {
    /**
     * Navigate to the auth page with a custom redirect URL
     * @param redirectUrl - URL to redirect to after successful authentication
     */
    navigateToAuth: (redirectUrl: string) => void;
  }
}

interface ImportMetaEnv {
  /** Supabase project URL (e.g. https://xyzcompany.supabase.co) */
  readonly VITE_SUPABASE_URL: string;
  /** Supabase anonymous/public API key */
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};