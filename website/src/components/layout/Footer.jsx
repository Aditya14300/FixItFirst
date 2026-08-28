import Link from "next/link";
// Sirf basic UI icons ko import kiya hai jo hamesha rahenge
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Custom SVGs for Social Icons (No third-party dependency needed)
  const socialLinks = [
    {
      name: "Facebook",
      url: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
      ),
    },
    {
      name: "Twitter",
      url: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
      ),
    },
    {
      name: "Instagram",
      url: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "#",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
      ),
    }
  ];

  return (
    <footer className="bg-slate-50 dark:bg-[#030712] border-t border-slate-200 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        
        {/* Main Footer Content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. Brand Section */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Fixit<span className="text-yellow-500">First</span>
              </h2>
              <p className="text-[11px] font-bold text-yellow-500 uppercase tracking-widest mt-1">
                Premium Services
              </p>
            </Link>
            
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your trusted home service platform connecting you with verified, background-checked professionals in minutes.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((social) => (
                <Link 
                  key={social.name} 
                  href={social.url} 
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-all hover:bg-yellow-400 hover:text-slate-900 dark:hover:bg-yellow-400 dark:hover:text-slate-900 hover:-translate-y-1"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['Home', 'About Us', 'How it Works', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-yellow-600 dark:hover:text-yellow-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Service Links */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Our Services
            </h3>
            <ul className="space-y-4">
              {['Electrician', 'Plumbing', 'AC Repair', 'Cleaning', 'Carpentry'].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors hover:text-yellow-600 dark:hover:text-yellow-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact & Support Section (Added) */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Contact Us
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                <MapPin size={18} className="text-yellow-500 shrink-0 mt-0.5" />
                <span>Bramhapur, Ganjam, Odisha<br />India</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                <Mail size={18} className="text-yellow-500 shrink-0" />
                <a href="mailto:thefixitfirst@gmail.com" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  thefixitfirst@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                <Phone size={18} className="text-yellow-500 shrink-0" />
                <a href="tel:+917735552029" className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors">
                  +91 77355 52029
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer Content */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left text-sm text-slate-500 dark:text-slate-400">
            &copy; {currentYear} FixitFirst. All rights reserved.
          </p>
          
          {/* Privacy & Terms Links */}
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}