import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useMode } from "@/context/ModeContext"
import {
  Menu,
  X,
  Home,
  Calendar,
  User,
  Bell,
  LogOut,
  ChevronDown,
  Search,
  Shield,
  Users,
  Settings,
  PlusCircle,
  Activity,
  MapPin,
  Trophy,
  CalendarCheck,
  Gamepad2,
  MousePointer2,
  Radio,
  Gamepad,
  ShoppingBag
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { mode, selectMode } = useMode()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const profileMenuRef = useRef(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
  }, [location.pathname])

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const handleLogout = async () => {
    try {
      setIsProfileMenuOpen(false)
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const unreadNotifications = user?.notifications?.filter((n) => !n.read)?.length || 0
  const isEsports = mode === 'esports'

  const defaultNavigation = [
    { name: "Home", path: "/home", icon: Home },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Venues", icon: MapPin, path: "/venues" },
    { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { name: "Store", icon: ShoppingBag, path: "/store" },
    { name: "Athletes", icon: Search, path: "/athletes" },
    { name: "Community", path: "/community", icon: Users },
  ]

  const esportsNavigation = [
    { name: "Home", path: "/esports", icon: Home },
    { name: "Tournaments", path: "/esports/tournaments", icon: Trophy },
    { name: "Games", path: "/esports/games", icon: Gamepad2 },
    { name: "Leaderboard", path: "/esports/leaderboard", icon: Activity },
    { name: "Store", path: "/store", icon: ShoppingBag },
    { name: "Players", path: "/esports/players", icon: User },
    { name: "Community", path: "/esports/community", icon: Users },
  ]

  const activeLinks = isEsports ? esportsNavigation : defaultNavigation

  // Dynamic header styles
  // Standard header styles for both modes
  const headerStyles = {
    header: cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled
        ? (isEsports ? "bg-[#09090b]/80 backdrop-blur-md border-b border-purple-500/20 py-2" : "glass shadow-sm py-2")
        : "bg-transparent border-transparent py-4",
    ),
    nav: cn(
      "backdrop-blur-sm px-2 py-1 rounded-full border",
      isEsports ? "bg-black/40 border-purple-500/20" : "bg-secondary/50 border-border/50"
    ),
    activeLink: cn(
      "shadow-sm transition-all duration-300",
      isEsports ? "bg-purple-600 text-white" : "bg-background text-primary"
    ),
    inactiveLink: cn(
      "transition-colors",
      isEsports ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-muted-foreground hover:text-foreground hover:bg-background/50"
    ),
    logoText: cn(
      "font-bold font-orbitron tracking-widest transition-all",
      isEsports
        ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        : "text-foreground group-hover:text-primary"
    ),
    actionBtn: cn(
      "transition-colors",
      isEsports ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    )
  }

  return (
    <>
      <header className={headerStyles.header}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex-shrink-0 mr-2 flex items-center gap-3">
              <Link to="/" className="flex items-center group">
                <span className={cn("text-2xl font-bold font-serif tracking-tight transition-colors", headerStyles.logoText)}>
                  PLAYMEET
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className={cn("hidden lg:flex items-center gap-1 backdrop-blur-sm px-2 py-1 rounded-full", headerStyles.nav)}>
              {activeLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path !== "/" && link.path !== "/esports" && location.pathname.startsWith(link.path))

                return (
                  <Link key={link.name} to={link.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "h-9 px-4 text-sm font-medium rounded-full transition-all duration-300",
                        isActive ? headerStyles.activeLink : headerStyles.inactiveLink
                      )}
                    >
                      {link.icon && <link.icon className="w-4 h-4 mr-2" />}
                      {link.name}
                    </Button>
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">

              {/* Mode Toggle */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/30 border border-border/50">
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer",
                  !isEsports ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )} onClick={() => { selectMode('athletes'); navigate('/home'); }}>Athletes</span>
                <Switch
                  checked={isEsports}
                  onCheckedChange={(checked) => {
                    const newMode = checked ? 'esports' : 'athletes';
                    selectMode(newMode);
                    navigate(newMode === 'esports' ? '/esports' : '/home');
                  }}
                  className={cn(
                    "data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-primary",
                    "shadow-inner"
                  )}
                />
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1 cursor-pointer",
                  isEsports ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-muted-foreground hover:text-foreground"
                )} onClick={() => { selectMode('esports'); navigate('/esports'); }}>
                  Esports <Gamepad className="w-3 h-3" />
                </span>
              </div>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Tooltip>
                    <TooltipTrigger>
                      <Link to="/notifications">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("relative rounded-full hover:bg-secondary", headerStyles.actionBtn)}
                        >
                          <Bell className="w-5 h-5" />
                          {unreadNotifications > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Notifications</p>
                    </TooltipContent>
                  </Tooltip>


                  {/* Profile Menu (Desktop) */}
                  <div className="relative hidden md:block" ref={profileMenuRef}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2 pl-2 pr-3 h-10 rounded-full border border-transparent transition-colors",
                        isEsports ? "hover:bg-purple-500/20 hover:border-purple-500/50 text-gray-200" : "hover:bg-secondary hover:border-border"
                      )}
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                      <Avatar className={cn(
                        "w-8 h-8 border-2 shadow-sm transition-colors",
                        isEsports ? "border-[#09090b]" : "border-background"
                      )}>
                        <AvatarImage src={user?.avatar?.url} />
                        <AvatarFallback className={cn(
                          "text-lg",
                          isEsports ? "bg-purple-500/20 text-purple-400" : "bg-primary/10 text-primary"
                        )}>
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium max-w-[100px] truncate">
                        {user?.name || "User"}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          isProfileMenuOpen && "rotate-180",
                        )}
                      />
                    </Button>

                    {isProfileMenuOpen && (
                      <div className={cn(
                        "absolute right-0 mt-2 w-64 backdrop-blur-xl rounded-2xl shadow-xl border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200",
                        isEsports ? "bg-[#09090b]/95 border-purple-500/20 text-gray-200" : "bg-popover/95 border-border/50 text-popover-foreground"
                      )}>
                        <div className="p-2">
                          <div className={cn(
                            "px-3 py-2 mb-1 rounded-xl",
                            isEsports ? "bg-white/5" : "bg-secondary/50"
                          )}>
                            <p className="text-sm font-semibold leading-none">{user?.name}</p>
                            <p className={cn("text-xs mt-1", isEsports ? "text-gray-400" : "text-muted-foreground")}>{user?.email}</p>
                          </div>
                          <div className={cn("h-px my-1", isEsports ? "bg-white/10" : "bg-border/50")} />

                          {[
                            { icon: User, label: "Profile", path: "/profile" },
                            { icon: Activity, label: "Dashboard", path: isEsports ? "/esports/dashboard" : "/dashboard" },
                            { icon: CalendarCheck, label: "My Bookings", path: "/my-bookings" },
                            { icon: Settings, label: "Settings", path: "/settings" },
                          ].map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsProfileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                                isEsports ? "hover:bg-purple-500/20 hover:text-purple-400" : "hover:bg-primary/10 hover:text-primary"
                              )}
                            >
                              <item.icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          ))}

                          {user?.role === "admin" && (
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setIsProfileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors font-medium",
                                isEsports ? "hover:bg-purple-500/20 text-purple-400" : "hover:bg-primary/10 text-primary"
                              )}
                            >
                              <Shield className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}

                          <div className={cn("h-px my-1", isEsports ? "bg-white/10" : "bg-border/50")} />

                          <button
                            onClick={handleLogout}
                            className={cn(
                              "flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-red-500",
                              isEsports ? "hover:bg-red-500/20" : "hover:bg-destructive/10"
                            )}
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Auth Buttons */
                <div className="hidden md:flex items-center gap-3">
                  <Link to="/login">
                    <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="rounded-full px-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-border shrink-0">
              <span className="text-lg font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1 overflow-y-auto overscroll-contain">
              <div className="px-4 py-4 space-y-4">
                {/* Navigation Links */}
                <div className="space-y-1">
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Navigation
                  </p>
                  {activeLinks.map((link) => {
                    const isActive = location.pathname === link.path
                    return (
                      <Link
                        key={link.name}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        {link.icon && <link.icon className="w-5 h-5" />}
                        {link.name}
                      </Link>
                    )
                  })}
                </div>

                {isAuthenticated ? (
                  <>
                    <div className="h-px bg-border" />

                    {/* Mobile Mode Toggle */}
                    <div className="space-y-3 px-3 py-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Platform Mode
                      </p>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/50">
                        <div className="flex flex-col gap-1">
                          <span className={cn(
                            "text-sm font-semibold transition-colors duration-300 cursor-pointer",
                            !isEsports ? "text-primary" : "text-muted-foreground"
                          )} onClick={() => { selectMode('athletes'); navigate('/home'); setIsMenuOpen(false); }}>Athletes</span>
                          <span className={cn(
                            "text-sm font-semibold transition-colors duration-300 flex items-center gap-1 cursor-pointer",
                            isEsports ? "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-muted-foreground"
                          )} onClick={() => { selectMode('esports'); navigate('/esports'); setIsMenuOpen(false); }}>
                            Esports <Gamepad className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <Switch
                          checked={isEsports}
                          onCheckedChange={(checked) => {
                            const newMode = checked ? 'esports' : 'athletes';
                            selectMode(newMode);
                            navigate(newMode === 'esports' ? '/esports' : '/home');
                            setIsMenuOpen(false);
                          }}
                          className={cn(
                            "scale-125 data-[state=checked]:bg-purple-600 data-[state=unchecked]:bg-primary shadow-lg"
                          )}
                        />
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    {/* Account Links */}
                    <div className="space-y-1">
                      <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Account
                      </p>
                      {[
                        { icon: User, label: "Profile", path: "/profile" },
                        { icon: Activity, label: "Dashboard", path: isEsports ? "/esports/dashboard" : "/dashboard" },
                        { icon: CalendarCheck, label: "My Bookings", path: "/my-bookings" },
                        { icon: Settings, label: "Settings", path: "/settings" },
                        ...(user?.role === "admin"
                          ? [{ icon: Shield, label: "Admin Panel", path: "/admin/dashboard" }]
                          : []),
                      ].map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full mt-2">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </ScrollArea>

            {isAuthenticated && (
              <div className="shrink-0 border-t border-border p-4 bg-background">
                <div className="flex items-center gap-3 mb-3 px-2">
                  <Avatar className="w-10 h-10 border-2 border-primary/20">
                    <AvatarImage src={user?.avatar?.url} />
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <Button variant="destructive" className="w-full gap-2" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default Header
