import React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Clock } from "lucide-react"

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground text-lg">Manage your account details and view your status.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 glass flex flex-col items-center justify-center py-10 text-center">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>{user.name}</CardTitle>
          <Badge variant="secondary" className="mt-2 capitalize">{user.role}</Badge>
        </Card>

        <Card className="md:col-span-2 shadow-xl border-none">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Personal information and role settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Email Address</span>
                <span className="text-lg font-semibold">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">System Role</span>
                <span className="text-lg font-semibold capitalize">{user.role}</span>
              </div>
            </div>

            {}

            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Last Login</span>
                <span className="text-lg font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
