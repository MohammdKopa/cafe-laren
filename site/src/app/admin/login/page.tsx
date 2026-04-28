import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session?.role === "owner") redirect("/admin");
  const sp = await searchParams;

  return (
    <main className="min-h-screen bg-paper-100 text-espresso-700 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          aria-label="Zurück zur Café-Laren-Startseite"
          className="flex items-baseline gap-2 justify-center mb-8 group"
        >
          <span className="font-display italic text-espresso-700 text-2xl">Café</span>
          <span className="not-italic font-display tracking-wider text-chiffon-200 bg-espresso-700 px-2 pt-0.5 pb-1 leading-none rounded-[2px] text-lg transition-transform duration-300 group-hover:translate-y-0.5">
            LAREN
          </span>
        </Link>

        <form
          action="/admin/login/submit"
          method="POST"
          className="rounded-2xl bg-paper-50 ring-1 ring-espresso-700/10 shadow-[var(--shadow-paper)] p-7 md:p-9"
        >
          <p className="font-body text-[10px] uppercase tracking-[0.42em] text-espresso-600/80 flex items-center gap-3">
            <span aria-hidden className="inline-block w-6 h-px bg-espresso-600/60" />
            Admin
          </p>
          <h1 className="mt-3 font-display italic text-espresso-700 text-3xl md:text-4xl leading-tight">
            Anmelden.
          </h1>
          <p className="mt-3 text-espresso-600/80 text-sm">
            Nur für Café Laren. Ein einfaches Passwort genügt.
          </p>

          <div className="mt-6">
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.42em] text-espresso-600/80 mb-2">
                Passwort
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
                autoFocus
                className="block w-full px-4 py-3 rounded-md bg-paper-100 ring-1 ring-espresso-700/15 text-espresso-700 placeholder:text-espresso-600/40 focus:outline-none focus:ring-2 focus:ring-espresso-700 transition tabular-nums"
              />
            </label>
          </div>

          {sp.error && (
            <p className="mt-3 text-[12px] text-red-700">
              Falsches Passwort. Versuch&apos;s nochmal.
            </p>
          )}

          <button
            type="submit"
            className="focus-on-dark mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-espresso-700 text-paper-50 text-[11px] uppercase tracking-[0.32em] font-medium hover:bg-espresso-800 transition active:scale-[0.97]"
          >
            Anmelden
            <span aria-hidden>→</span>
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.42em] text-espresso-600/55">
          <Link href="/" className="hover:text-espresso-700 transition">
            Zurück zur Website
          </Link>
        </p>
      </div>
    </main>
  );
}
