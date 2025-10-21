import { navLinks } from "@/constants";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Umumiy stil (desktop va mobile uchun ham ishlaydi)
  const linkStyles =
    "block w-full px-4 py-2 text-center border border-[#3F8CFF] text-[#3F8CFF] rounded-md " +
    "hover:bg-[#3F8CFF1A] active:bg-[#3F8CFF33] transition-all font-medium";

  return (
    <header className="text-black bg-white border-b border-gray-300">
      {/* Container o‘rniga to‘liq kenglik (yopishish uchun) */}
      <div className="w-full px-0">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 border border-[#3F8CFF] rounded-md text-[#3F8CFF] hover:bg-[#3F8CFF1A] active:bg-[#3F8CFF33] transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:block w-full">
            <ul className="flex gap-[15px]">
              {navLinks.map((link) => (
                <li key={link.label} className="flex-1">
                  <a href={link.href} className={linkStyles}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 border-t border-[#3F8CFF] px-4">
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={linkStyles}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
