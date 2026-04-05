import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowRight, UserPlus, FileText, Calendar, Sparkles, ShieldCheck, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export const HomePage = () => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col gap-16 py-10">
      <section className="flex flex-col gap-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mx-auto flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
          <Sparkles className="h-4 w-4" />
          The future of HR management is here
        </div>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl bg-gradient-to-br from-slate-900 via-primary to-slate-800 bg-clip-text text-transparent pb-2 px-2">
          Empower Your Workforce
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed px-4">
          The all-in-one HRMS that automates attendance, streamlines leave requests, and provides deep insights into your team's productivity.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 px-6 sm:px-0">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 px-8 shadow-xl shadow-primary/20">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full gap-2 px-8 shadow-xl shadow-primary/20">
                  Get Started for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full px-8 glass hover:bg-white/50">
                  Live Demo
                </Button>
              </Link>
            </>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <Card className="glass group hover:scale-105 transition-all duration-300 border-none">
          <CardHeader>
            <div className="p-3 w-content rounded-2xl bg-blue-500/10 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <UserPlus className="h-8 w-8" />
            </div>
            <CardTitle>Smart Onboarding</CardTitle>
            <CardDescription className="text-base">Experience seamless employee management with automated profiles and document tracking.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary/80">
              <Zap className="h-4 w-4" />
              Real-time synchronization
            </div>
          </CardContent>
        </Card>

        <Card className="glass group hover:scale-105 transition-all duration-300 border-none shadow-2xl shadow-primary/5">
          <CardHeader>
            <div className="p-3 w-content rounded-2xl bg-green-500/10 text-green-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-8 w-8" />
            </div>
            <CardTitle>Dynamic Attendance</CardTitle>
            <CardDescription className="text-base">Precision tracking with biometric-ready logs and comprehensive daily history exports.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-2 text-sm font-semibold text-primary/80">
              <ShieldCheck className="h-4 w-4" />
              Verified logs
            </div>
          </CardContent>
        </Card>

        <Card className="glass group hover:scale-105 transition-all duration-300 border-none">
          <CardHeader>
            <div className="p-3 w-content rounded-2xl bg-purple-500/10 text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-8 w-8" />
            </div>
            <CardTitle>Lean Leave Flows</CardTitle>
            <CardDescription className="text-base">Sophisticated leave management with auto-balance calculation and recursive approval trees.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary/80">
              <Sparkles className="h-4 w-4" />
              Automated balance tracking
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
