import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User as UserIcon, LogOut, LayoutDashboard, Menu, X, Home } from "lucide-react"
import { useState } from "react"

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const navLinks = [
    { title: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { 
      title: "Dashboard", 
      path: user?.role === "admin" ? "/admin" : "/dashboard" ,
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      show: !!user 
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-4">
          {}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-primary">HRMS</span>
          </Link>

          {}
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.filter(l => l.show !== false).map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {!user ? (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" className="hidden sm:inline-block">
                <Button size="sm" className="text-sm font-medium">Get Started</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 h-9 px-3">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline whitespace-nowrap overflow-hidden max-w-[100px] text-ellipsis">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top-4 duration-200">
          <nav className="container flex flex-col p-4 gap-4">
            {navLinks.filter(l => l.show !== false).map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-2"
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
            {!user && (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full justify-start h-9" variant="default">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

