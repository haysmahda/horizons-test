
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="text-2xl font-bold text-primary">TravelExp</span>
            <p className="mt-4 text-sm text-white/80">
              Discover the world through local eyes. Authentic experiences curated by locals.
            </p>
          </div>

          <div>
            <span className="font-semibold text-white mb-4 block">Company</span>
            <nav className="space-y-2">
              <Link to="/about" className="block text-sm text-white/80 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/careers" className="block text-sm text-white/80 hover:text-white transition-colors">
                Careers
              </Link>
              <Link to="/press" className="block text-sm text-white/80 hover:text-white transition-colors">
                Press
              </Link>
              <Link to="/blog" className="block text-sm text-white/80 hover:text-white transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          <div>
            <span className="font-semibold text-white mb-4 block">Support</span>
            <nav className="space-y-2">
              <Link to="/help" className="block text-sm text-white/80 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link to="/contact" className="block text-sm text-white/80 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link to="/safety" className="block text-sm text-white/80 hover:text-white transition-colors">
                Safety
              </Link>
              <Link to="/cancellation" className="block text-sm text-white/80 hover:text-white transition-colors">
                Cancellation Policy
              </Link>
            </nav>
          </div>

          <div>
            <span className="font-semibold text-white mb-4 block">Follow Us</span>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            © 2026 TravelExp. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-white/60 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
