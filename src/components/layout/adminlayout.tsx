import { Outlet, Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const AdminLayout = () => {
  const location = useLocation()

  const navItems = [
    { path: "/admin/students", label: "👩‍🎓 O‘quvchilar" },
    { path: "/admin/teachers", label: "👨‍🏫 O‘qituvchilar" },
    { path: "/admin/groups", label: "🧑‍💻 Guruhlar" },
  ]

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col">
      {/* Header / Navbar */}
      <header className="w-full bg-neutral-800 border-b border-neutral-700 px-8 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold tracking-wide text-blue-400">
          Admin Panel
        </h1>

        <nav className="flex gap-6">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-all duration-300",
                  active
                    ? "text-blue-400"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 bottom-0 h-[2px] w-full bg-blue-500 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold transition">
          Chiqish
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
