const paths = {
  smartphone: <><rect x="5" y="2" width="14" height="20" rx="2.5" /><path d="M11 18h2" /></>,
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
  card: <><rect x="2" y="5" width="20" height="14" rx="2.5" /><path d="M2 10h20" /></>,
  store: <><path d="M3 9l1.2-4.5A2 2 0 0 1 6.13 3h11.74a2 2 0 0 1 1.93 1.5L21 9" /><path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
  globe: <><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19" /><path d="M12 2.5c2.8 3 2.8 16 0 19M12 2.5c-2.8 3-2.8 16 0 19" /></>,
  message: <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-1L3 20l1.3-4.5a8.5 8.5 0 0 1-1-4A8.38 8.38 0 0 1 11.5 3h.5a8.38 8.38 0 0 1 8.5 8.5Z" />,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v2.5M15 2v2.5M9 19.5V22M15 19.5V22M2 9h2.5M2 15h2.5M19.5 9H22M19.5 15H22" /></>,
  check: <path d="M20 6 9 17l-5-5" />,
  checkCircle: <><circle cx="12" cy="12" r="9.5" /><path d="M8 12.5l2.5 2.5L16 9" /></>,
  rocket: <><path d="M5 16c-1.5 1-2 5-2 5s4-.5 5-2c.6-.9.5-2.2-.3-3-.8-.8-2.1-.9-2.7-.0Z" /><path d="M9 13a14 14 0 0 1 7-9c2.5 0 4 1.5 4 4a14 14 0 0 1-9 7l-2-2Z" /><circle cx="15" cy="9" r="1.4" /></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  shield: <path d="M12 2.5 4.5 5.5v6c0 4.5 3.2 7.6 7.5 10 4.3-2.4 7.5-5.5 7.5-10v-6L12 2.5Z" />,
  sparkles: <><path d="M12 3l1.6 4.6L18 9l-4.4 1.4L12 15l-1.6-4.6L6 9l4.4-1.4L12 3Z" /><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" /></>,
  wave: <path d="M2 12c2 0 2-3 4-3s2 6 4 6 2-9 4-9 2 6 4 6 2-3 4-3" />,
  facebook: <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V9H6.5v3H9v9h3v-9h2.5l.5-3H12V6.5a.5.5 0 0 1 .5-.5H15V3Z" />,
  twitter: <path d="M4 4l7 8.5L4.5 20H7l5-5.5L16 20h4l-7.3-9L19.5 4H17l-4.5 5L8.5 4H4Z" />,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="2.5" /><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 10v7" /></>,
};

export default function Icon({ name, size = 24, strokeWidth = 1.75, className = '', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
