import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  overline,
  title,
  description,
  actions,
}: {
  overline?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {overline && (
          <p className="font-body text-[11px] uppercase tracking-[0.42em] text-espresso-600/80 flex items-center gap-3">
            <span aria-hidden className="inline-block w-6 h-px bg-espresso-600/60" />
            {overline}
          </p>
        )}
        <h1 className="mt-3 font-display italic text-espresso-700 leading-[0.95] text-[clamp(2rem,4.5vw,3.4rem)]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-xl text-espresso-600/85 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </header>
  );
}

export function PrimaryButton({
  children,
  type = "submit",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...rest}
      className="focus-on-dark inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-espresso-700 text-paper-50 text-[11px] uppercase tracking-[0.28em] font-medium hover:bg-espresso-800 transition active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  type = "button",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...rest}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-paper-50 text-espresso-700 ring-1 ring-espresso-700/20 text-[11px] uppercase tracking-[0.28em] font-medium hover:bg-paper-200 transition active:scale-[0.97]"
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  type = "submit",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      {...rest}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-paper-50 text-red-700 ring-1 ring-red-700/30 text-[10px] uppercase tracking-[0.28em] font-medium hover:bg-red-700/8 hover:ring-red-700/50 transition active:scale-[0.97]"
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
}) {
  const cls =
    variant === "primary"
      ? "bg-espresso-700 text-paper-50 hover:bg-espresso-800 focus-on-dark"
      : "bg-paper-50 text-espresso-700 ring-1 ring-espresso-700/20 hover:bg-paper-200";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.28em] font-medium transition active:scale-[0.97] ${cls}`}
    >
      {children}
    </Link>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.42em] text-espresso-600/80 mb-2">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block mt-1.5 text-[11px] text-espresso-600/65">
          {hint}
        </span>
      )}
    </label>
  );
}

export function inputClass(extra = "") {
  return `block w-full px-4 py-2.5 rounded-md bg-paper-50 ring-1 ring-espresso-700/15 text-espresso-700 placeholder:text-espresso-600/45 focus:outline-none focus:ring-2 focus:ring-espresso-700 transition ${extra}`;
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-paper-50 ring-1 ring-espresso-700/10 shadow-[var(--shadow-paper)] ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
}) {
  return (
    <Card className="p-6 md:p-7">
      <p className="text-[10px] uppercase tracking-[0.42em] text-espresso-600/75">
        {label}
      </p>
      <p className="mt-3 font-display italic text-espresso-700 text-[clamp(2.4rem,5vw,3.4rem)] leading-none tabular-nums">
        {value}
      </p>
      {sublabel && (
        <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-espresso-600/65">
          {sublabel}
        </p>
      )}
    </Card>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="px-6 py-12 md:px-10 md:py-16 text-center">
      <p className="font-display italic text-espresso-700 text-2xl md:text-3xl leading-tight">
        {title}
      </p>
      {body && (
        <p className="mt-3 max-w-md mx-auto text-espresso-600/85 text-sm md:text-base leading-relaxed">
          {body}
        </p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </Card>
  );
}

export function Toggle({
  name,
  defaultChecked,
  label,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
}) {
  // Peer-checked pattern with siblings inside a wrapper. Works without
  // CSS :has() (still supported, but every modern browser handles peer).
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className="relative inline-block w-11 h-6 flex-shrink-0">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-espresso-700/15 peer-checked:bg-sun-400 transition-colors duration-200"
        />
        <span
          aria-hidden
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-paper-50 shadow transition-transform duration-200 peer-checked:translate-x-5 pointer-events-none"
        />
      </span>
      <span className="text-[11px] uppercase tracking-[0.28em] text-espresso-700">
        {label}
      </span>
    </label>
  );
}
