import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import {
  Users,
  CheckCircle,
  Search,
  UserCheck,
  FileText
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import api from "@/services/api"
import { approveLeave, rejectLeave } from "@/services/leaveService"

export const AdminDashboard: React.FC = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [leaves, setLeaves] = useState<any[]>([])
  const [usersPagination, setUsersPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 })
  const [attendancePagination, setAttendancePagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 })
  const [leavesPagination, setLeavesPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 })
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers(1)
    fetchAttendance(1)
    fetchLeaves(1)
    console.log("Logged in as:", currentUser?.name)
  }, [])

  const fetchUsers = async (page: number) => {
    setIsLoading(true)
    try {
      const res = await api.get(`/admin/users?page=${page}&limit=${ITEMS_PER_PAGE}`)
      setUsers(res.data.data.users)
      setUsersPagination(res.data.data.pagination)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAttendance = async (page: number) => {
    setIsLoading(true)
    try {
      const res = await api.get(`/admin/attendance?page=${page}&limit=${ITEMS_PER_PAGE}`)
      setAttendance(res.data.data.attendance)
      setAttendancePagination(res.data.data.pagination)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch attendance")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLeaves = async (page: number) => {
    setIsLoading(true)
    try {
      const res = await api.get(`/admin/leaves?page=${page}&limit=${ITEMS_PER_PAGE}`)
      setLeaves(res.data.data.leaves)
      setLeavesPagination(res.data.data.pagination)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch leaves")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      await approveLeave(id)
      toast.success("Leave approved successfully")
      fetchLeaves(leavesPagination.currentPage)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve leave")
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectLeave(id)
      toast.success("Leave rejected successfully")
      fetchLeaves(leavesPagination.currentPage)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject leave")
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8">
      {isLoading && <div className="fixed top-0 left-0 w-full h-1 bg-primary/30 animate-pulse" />}
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <p className="text-muted-foreground text-lg">
          Global overview of employees, attendance, and system performance.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-none bg-white/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usersPagination.totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">Active users in system</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-none bg-white/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <UserCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {attendance.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Clocked in today</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-none bg-white/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Leave Balance</CardTitle>
            <FileText className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {}
              20
            </div>
            <p className="text-xs text-muted-foreground mt-1">Days per employee</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-none bg-white/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">All services operational</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="bg-muted/50 p-1 mb-6">
          <TabsTrigger value="employees" className="px-8">Employees</TabsTrigger>
          <TabsTrigger value="attendance" className="px-8">Attendance</TabsTrigger>
          <TabsTrigger value="leaves" className="px-8">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card className="shadow-xl border-none">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>Manage and view all registered employees.</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">No employees found.</TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-semibold">{user.name}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(user.joiningDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span className={user.leaveBalance < 5 ? "text-destructive font-bold" : ""}>
                              {user.leaveBalance} Days
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={user.isDeleted ? "destructive" : user.status === "active" ? "default" : "secondary"}>
                              {user.isDeleted ? "Deleted" : user.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {(usersPagination.currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(usersPagination.currentPage * ITEMS_PER_PAGE, usersPagination.totalItems)} of {usersPagination.totalItems} employees
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={usersPagination.currentPage === 1}
                    onClick={() => fetchUsers(usersPagination.currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={usersPagination.currentPage === usersPagination.totalPages}
                    onClick={() => fetchUsers(usersPagination.currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="shadow-xl border-none">
            <CardHeader>
              <CardTitle>System Attendance</CardTitle>
              <CardDescription>Live feed of all employee clock-ins.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">No attendance records found.</TableCell>
                    </TableRow>
                  ) : (
                    attendance.map((record) => (
                      <TableRow key={record._id}>
                        <TableCell className="font-semibold">
                          <div className="flex flex-col">
                            <span>{record.userId?.name}</span>
                            <span className="text-xs text-muted-foreground font-normal">{record.userId?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 capitalize">
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(attendancePagination.currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(attendancePagination.currentPage * ITEMS_PER_PAGE, attendancePagination.totalItems)} of {attendancePagination.totalItems} records
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={attendancePagination.currentPage === 1}
                  onClick={() => fetchAttendance(attendancePagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={attendancePagination.currentPage === attendancePagination.totalPages}
                  onClick={() => fetchAttendance(attendancePagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card className="shadow-xl border-none">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and process employee leave applications.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">No leave requests found.</TableCell>
                    </TableRow>
                  ) : (
                    leaves.map((leave: any) => (
                      <TableRow key={leave._id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{leave.userId?.name}</span>
                            <span className="text-xs text-muted-foreground">{leave.userId?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{leave.leaveType}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{leave.totalDays}</TableCell>
                        <TableCell className="max-w-[150px] truncate" title={leave.reason}>{leave.reason}</TableCell>
                        <TableCell>
                          <Badge variant={
                            leave.status === "approved" ? "default" :
                              leave.status === "pending" ? "outline" :
                                "destructive"
                          } className="capitalize">
                            {leave.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {leave.status === "pending" && (
                            <div className="flex justify-end gap-2">
                              <Button size="sm" onClick={() => handleApprove(leave._id)} className="bg-green-600 hover:bg-green-700 h-8 px-2">Approve</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(leave._id)} className="h-8 px-2">Reject</Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {(leavesPagination.currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(leavesPagination.currentPage * ITEMS_PER_PAGE, leavesPagination.totalItems)} of {leavesPagination.totalItems} requests
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={leavesPagination.currentPage === 1}
                  onClick={() => fetchLeaves(leavesPagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={leavesPagination.currentPage === leavesPagination.totalPages}
                  onClick={() => fetchLeaves(leavesPagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
