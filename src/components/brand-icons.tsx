export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v7h3v-7h2.2l.8-3H14v-1.5A.5.5 0 0 1 14.5 9H16z" />
    </svg>
  );
}

export function SnapchatIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c2.6 0 4.2 1.9 4.3 4.2.05 1 0 1.9-.05 2.5.6.35 1.35.5 1.75.55.4.05.75.35.6.85-.1.35-.6.85-1.85 1.2-.1.55.05 1.1.65 1.7.55.55 1.35.75 1.35 1.2 0 .5-.9.7-1.7.85-.25.55-.15 1.15-.85 1.25-.5.05-1.05-.1-1.55 0-.5.1-.85.7-1.9.7s-1.4-.6-1.9-.7c-.5-.1-1.05.05-1.55 0-.7-.1-.6-.7-.85-1.25-.8-.15-1.7-.35-1.7-.85 0-.45.8-.65 1.35-1.2.6-.6.75-1.15.65-1.7-1.25-.35-1.75-.85-1.85-1.2-.15-.5.2-.8.6-.85.4-.05 1.15-.2 1.75-.55-.05-.6-.1-1.5-.05-2.5C7.8 4.9 9.4 3 12 3z" />
    </svg>
  );
}

export function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3c.3 2 1.7 3.4 3.7 3.6V9.3c-1.4 0-2.6-.4-3.7-1.2v6.4a5.3 5.3 0 1 1-4.6-5.25v2.8a2.5 2.5 0 1 0 1.9 2.43V3H16z" />
    </svg>
  );
}
