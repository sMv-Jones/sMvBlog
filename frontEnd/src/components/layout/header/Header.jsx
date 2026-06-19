import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Logo, LogoutBtn } from '../../index'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "About", slug: "/about", active: true },
    { name: "Contact", slug: "/contact", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "My Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Dashboard", slug: "/dashboard", active: authStatus },
  ]

  const navClass =
    "px-4 py-2 text-lg font-medium rounded-full transition-all duration-200 hover:bg-white/10"

  return (
    <header className="bg-[#000000]/85 backdrop-blur-md text-white border-b border-white/10">
      <nav className="flex items-center justify-between py-3 px-4 md:px-10">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <Logo width="100px" />
          </Link>

          <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-white/90">
            sMv|Blog
          </h1>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-2 ml-auto">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className={navClass}
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}

          {authStatus && (
            <li className="ml-3">
              <LogoutBtn className={navClass} />
            </li>
          )}
        </ul>

        {/* Mobile Button */}
        <button
          className="md:hidden text-3xl px-2 py-1 rounded-md hover:bg-white/10 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="mt-2 bg-white/5 border border-white/10 rounded-xl p-2">
            <ul className="flex flex-col gap-2">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug)
                        setMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 text-lg font-medium rounded-lg hover:bg-white/10 transition"
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}

              {authStatus && (
                <li className="mt-2">
                  <LogoutBtn className="w-full text-left px-4 py-3 text-lg font-medium rounded-lg hover:bg-red-600/10 transition" />
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header