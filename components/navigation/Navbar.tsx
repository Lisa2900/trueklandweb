"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, MessageCircle, User, Sparkles, ArrowLeftRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"

export default function Navbar() {
  const pathname = usePathname()
  const [unreadChats, setUnreadChats] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return

    const chatsRef = collection(db, "chats")
    const q = query(chatsRef, where("users", "array-contains", user.email))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let count = 0
      snapshot.docs.forEach((doc) => {
        const data = doc.data()
        // Solo cuenta si hay mensajes no leídos y el último mensaje no es del usuario actual
        if (
          data.unreadCount &&
          data.unreadCount > 0 &&
          data.lastMessageSender !== user.email
        ) {
          count++
        }
      })
      setUnreadChats(count)
    })

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    {
      name: "Inicio",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Explorar",
      href: "/explore",
      icon: Search,
    },
    {
      name: "Intercambios",
      href: "/exchanges",
      icon: ArrowLeftRight,
    },
    {
      name: "Publicar",
      href: "/add-post",
      icon: PlusSquare,
    },
    {
      name: "Chats",
      href: "/chats",
      icon: MessageCircle,
      badge: unreadChats > 0 ? unreadChats : null,
    },
    {
      name: "Perfil",
      href: "/profile",
      icon: User,
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          "hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "glass border-b border-[var(--color-gris-300)] shadow-2xl shadow-black/5"
            : "bg-white/95 backdrop-blur-lg border-b border-[var(--color-gris-200)]",
        )}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />

        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo with enhanced effects */}
            <Link href="/dashboard" className="flex items-center py-3 group relative">
              <div className="relative">
                <div className="absolute inset-0 bg-[var(--color-turquesa)]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative h-14 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1">
                  <Image
                    src="/TrueklandNavBar.png"
                    width={220}
                    height={220}
                    alt="TrueKland"
                    className="h-full w-auto object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[var(--color-amarillo)] opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
            </Link>

            {/* Navigation Items with solid colors */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <div key={item.name} className="relative group">
                    <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "relative flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 font-semibold text-sm border-2 overflow-hidden",
                          isActive
                            ? "bg-[var(--color-turquesa)] text-white shadow-[var(--shadow-turquesa)] border-[var(--color-turquesa)]/30 scale-105"
                            : "text-[var(--color-azul-oscuro)] hover:bg-[var(--color-amarillo)] hover:text-[var(--color-gris-oscuro)] border-transparent hover:scale-105 hover:shadow-[var(--shadow-amarillo)]",
                        )}
                      >
                        <div className="relative flex items-center gap-3">
                          <div className="relative">
                            <item.icon
                              className={cn(
                                "h-5 w-5 transition-all duration-300",
                                isActive ? "drop-shadow-sm" : "group-hover:scale-110",
                              )}
                            />
                            {item.badge && (
                              <span className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                                <Badge
                                  variant="destructive"
                                  className="flex items-center justify-center h-5 w-5 p-0 text-xs font-bold bg-[var(--color-rojo-suave)] text-white border-2 border-white rounded-full shadow"
                                >
                                  {item.badge > 99 ? "99+" : item.badge}
                                </Badge>
                              </span>
                            )}
                          </div>
                          <span className="hidden lg:inline font-medium tracking-wide">{item.name}</span>
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-white/30 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </Button>
                    </Link>

                    {/* Floating indicator */}
                    {isActive && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-turquesa)] animate-pulse shadow-lg" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation with new colors */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-[var(--color-gris-300)] shadow-2xl shadow-black/10 mobile-nav safe-area-bottom">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />

        <div className="flex justify-around items-center h-20 sm:h-24 px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.name} className="relative group flex-1 max-w-[80px]">
                <Link href={item.href} aria-current={isActive ? "page" : undefined} className="block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "relative flex flex-col items-center justify-center h-16 sm:h-18 w-full p-2 sm:p-3 rounded-2xl sm:rounded-3xl transition-all duration-300 border-2 overflow-hidden touch-target",
                      isActive
                        ? "bg-[var(--color-turquesa)] text-white shadow-[var(--shadow-turquesa)] border-[var(--color-turquesa)]/30 scale-105"
                        : "text-[var(--color-azul-oscuro)] hover:bg-[var(--color-amarillo)] hover:text-[var(--color-gris-oscuro)] border-transparent hover:scale-105 hover:shadow-[var(--shadow-amarillo)]",
                    )}
                  >
                    <div className="relative z-10 flex flex-col items-center gap-1">
                      <div className="relative">
                        <item.icon
                          className={cn(
                            "h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300",
                            isActive ? "drop-shadow-sm" : "group-hover:scale-110",
                          )}
                        />
                        {item.badge && (
                          <span className="absolute -top-2 -right-2 z-20">
                            <Badge
                              variant="destructive"
                              className="flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 p-0 text-[9px] sm:text-[10px] font-bold bg-[var(--color-rojo-suave)] text-white border-2 border-white rounded-full shadow"
                            >
                              {item.badge > 9 ? "9+" : item.badge}
                            </Badge>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs font-semibold leading-tight tracking-wide mobile-friendly-text">{item.name}</span>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-white/30 -translate-y-full group-hover:translate-y-full transition-transform duration-700" />
                  </Button>
                </Link>

                {/* Floating indicator */}
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--color-turquesa)] animate-pulse shadow-lg" />
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="hidden md:block h-20" />
      <div className="md:hidden h-20 sm:h-24" />
    </>
  )
}
