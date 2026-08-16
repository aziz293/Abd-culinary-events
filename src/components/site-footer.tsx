import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { InstagramIcon, SnapchatIcon, TikTokIcon } from "@/components/brand-icons";

export function SiteFooter() {
  return (
    <footer className="bg-noir text-cream/80 mt-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-[auto_1fr_1fr_1fr] items-start">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/abd-logo-light.png" alt="ABD Culinary Events" className="w-28 h-28 shrink-0 object-contain" />

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-brass-bright mb-4">
            Contact
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brass" />
              <span>HLM Grand Yoff, Parking Dakar Dem Dikk</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-brass" />
              <a href="tel:+221778897668" className="hover:text-brass-bright">
                77 889 76 68
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-brass" />
              <a href="mailto:abdculinaryevents@gmail.com" className="hover:text-brass-bright">
                abdculinaryevents@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-brass-bright mb-4">
            Explorer
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/restaurant" className="hover:text-brass-bright">Le restaurant</Link></li>
            <li><Link href="/menu" className="hover:text-brass-bright">Le menu</Link></li>
            <li><Link href="/traiteur" className="hover:text-brass-bright">Service traiteur</Link></li>
            <li><Link href="/galerie" className="hover:text-brass-bright">Galerie</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs uppercase tracking-widest text-brass-bright mb-4">
            Réserver
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/reservation" className="hover:text-brass-bright">Réserver une table</Link></li>
            <li><Link href="/devis" className="hover:text-brass-bright">Demander un devis</Link></li>
          </ul>
          <div className="flex gap-4 mt-5">
            <a href="https://www.instagram.com/abddiarra/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-block hover:text-brass-bright transition-transform duration-300 ease-out hover:scale-125 hover:-rotate-6">
              <InstagramIcon />
            </a>
            <a href="https://snapchat.com/t/Oif0WwY1" target="_blank" rel="noopener noreferrer" aria-label="Snapchat" className="inline-block hover:text-brass-bright transition-transform duration-300 ease-out hover:scale-125 hover:rotate-6">
              <SnapchatIcon />
            </a>
            <a href="https://www.tiktok.com/@abd_culinary_events" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="inline-block hover:text-brass-bright transition-transform duration-300 ease-out hover:scale-125 hover:-rotate-6">
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-brass/15 py-5">
        <p className="text-center text-xs font-mono text-cream/40 tracking-wide">
          © {new Date().getFullYear()} ABD Culinary Events — Dakar, Sénégal ·{" "}
          <Link href="/admin" className="hover:text-cream/70">
            Administration
          </Link>
        </p>
      </div>
    </footer>
  );
}
