import Link from "next/link";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Login + logout render unframed — they don't need (and can't have)
  // the authenticated shell.
  if (!session) {
    return (
      <div className="min-h-screen bg-paper-100 text-espresso-700">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-100 text-espresso-700">
      <AdminTopNav />
      <main className="max-w-[var(--shell-max)] mx-auto px-6 md:px-10 pt-8 pb-24">
        {children}
      </main>
    </div>
  );
}

function AdminTopNav() {
  return (
    <header className="sticky top-0 z-40 bg-paper-100/95 backdrop-blur-md border-b border-espresso-700/10">
      <div className="max-w-[var(--shell-max)] mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
        <Link
          href="/admin"
          className="font-display italic text-espresso-700 text-lg md:text-xl flex items-baseline gap-2 group rounded-[2px]"
        >
          <span>Café</span>
          <span className="not-italic font-display tracking-wider text-chiffon-200 bg-espresso-700 px-2 pt-0.5 pb-1 leading-none rounded-[2px] text-sm">
            LAREN
          </span>
          <span className="text-[10px] uppercase tracking-[0.42em] text-espresso-600/65 ml-2 not-italic">
            Admin
          </span>
        </Link>

        <nav
          aria-label="Admin-Navigation"
          className="flex items-center gap-1 sm:gap-3 md:gap-5 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.32em]"
        >
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/menu">Menü</NavLink>
          <NavLink href="/admin/angebote">Angebote</NavLink>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-espresso-600/75 hover:text-espresso-900 transition rounded-[2px]"
          >
            Vorschau <span aria-hidden>↗</span>
          </Link>
          <Link
            href="/admin/logout"
            className="inline-flex items-center px-3 py-2 text-espresso-600/75 hover:text-espresso-900 transition rounded-[2px]"
          >
            Abmelden
          </Link>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-3 py-2 text-espresso-700 hover:text-espresso-900 transition rounded-[2px]"
    >
      {children}
    </Link>
  );
}
