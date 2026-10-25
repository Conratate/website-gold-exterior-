import Link from "next/link";
import { CHARITY } from "@/lib/promos";

// Site-wide strip pointing at the charity page.
export default function CharityBanner() {
  return (
    <Link
      href="/charity"
      className="block bg-gold-400 text-charcoal-900 transition hover:bg-gold-300"
    >
      <div className="container-x flex min-h-[44px] flex-wrap items-center justify-center gap-x-3 py-2 text-center text-sm">
        <span className="font-display font-extrabold">
          We donate {CHARITY.percent}% of every job to {CHARITY.name}.
        </span>
        <span className="hidden font-semibold underline underline-offset-2 sm:inline">
          Help us feed people →
        </span>
      </div>
    </Link>
  );
}
