import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export const MainLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-10">
          <Outlet />
        </div>
      </main>
      <footer className="border-t py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Rizwan Ali. The HR Management System.
          </p>
        </div>
      </footer>
    </div>
  )
}
