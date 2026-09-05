'use client';

import { XLogo, GitHubLogo, DiscordLogo } from '../BrandLogos';

export default function FooterHome() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full border-t border-white/[0.08] bg-black/25 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] py-12">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">OrbitAI</h3>
            <p className="text-sm text-gray-400">
              Your AI companion for everything onchain
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Platform
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Simulations
                </a>
              </li>
              <li>
                <a href="#security" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="/#faq" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Docs
                </a>
              </li>
              <li>
                <a href="#blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">Social</h4>
            <div className="flex gap-3">
              <a
                href="https://x.com"
                title="X / Twitter"
                className="w-9 h-9 rounded-xl border border-white/[0.15] bg-white/[0.04] backdrop-blur-xl flex items-center justify-center text-gray-300 hover:text-oro-gold hover:border-oro-border-gold/60 hover:bg-white/[0.08] transition-all"
              >
                <XLogo className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                title="GitHub"
                className="w-9 h-9 rounded-xl border border-white/[0.15] bg-white/[0.04] backdrop-blur-xl flex items-center justify-center text-gray-300 hover:text-oro-gold hover:border-oro-border-gold/60 hover:bg-white/[0.08] transition-all"
              >
                <GitHubLogo className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://discord.com"
                title="Discord"
                className="w-9 h-9 rounded-xl border border-white/[0.15] bg-white/[0.04] backdrop-blur-xl flex items-center justify-center text-gray-300 hover:text-oro-gold hover:border-oro-border-gold/60 hover:bg-white/[0.08] transition-all"
              >
                <DiscordLogo className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {currentYear} OrbitAI Protocol. Powered by Precision. Driven by Intent.
          </p>
          <div className="flex gap-6">
            <a href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
