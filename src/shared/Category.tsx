import { CategoryNavigate } from "@/constants";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Category() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkStyles =
    "block w-full px-8 py-2 text-center border border-[#3F8CFF] text-[#3F8CFF] rounded-md " +
    "hover:bg-[#3F8CFF1A] active:bg-[#3F8CFF33] transition-all font-medium";

  return (
    <header className="w-[98%] mx-auto rounded-2xl my-4 bg-white border-b border-gray-200 shadow-sm rounded-b-xl z-30">
      <div className=" mx-auto py-6 px-4 sm:px-6">
        {/* Top row */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 border border-[#3F8CFF] rounded-md text-[#3F8CFF] hover:bg-[#3F8CFF1A] active:bg-[#3F8CFF33] transition-all"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop nav */}
          <nav className="hidden  md:block flex-1">
            <ul className="flex justify-between gap-4 lg:gap-6 flex-wrap">
              {CategoryNavigate.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkStyles}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile nav – inside header */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
            isMenuOpen ? "max-h-[400px] pb-4" : "max-h-0"
          }`}
        >
          <nav className="border-t border-[#3F8CFF] pt-3">
            <ul className="space-y-2">
              {CategoryNavigate.map((link) => (
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
        </div>
      </div>
    </header>
  );
}
