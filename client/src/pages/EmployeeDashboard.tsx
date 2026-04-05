import React, { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  FileText,
  XCircle
} from "lucide-react"
import { markAttendance, getMyAttendance } from "@/services/attendanceService"
import { applyLeave, getMyLeaves, cancelLeave, editLeave } from "@/services/leaveService"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const leaveSchema = z.object({
  leaveType: z.string().min(1, { message: "Please select leave type" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  reason: z.string().min(10, { message: "Reason must be at least 10 characters" }),
})

type LeaveFormValues = z.infer<typeof leaveSchema>

const formatDateToDDMMYYYY = (dateString: string) => {
  if (!dateString) return ""
  const [year, month, day] = dateString.split("-")
  return `${day}/${month}/${year}`
}

const formatDateToYYYYMMDD = (isoString: string) => {
  if (!isoString) return ""
  const date = new Date(isoString)
  return date.toISOString().split("T")[0]
}

export const EmployeeDashboard: React.FC = () => {
  const { user, refreshUser } = useAuth()

  
  const [leaves, setLeaves] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])

  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [editingLeave, setEditingLeave] = useState<any>(null)

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    },
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (editingLeave) {
      form.reset({
        leaveType: editingLeave.leaveType,
        startDate: formatDateToYYYYMMDD(editingLeave.startDate),
        endDate: formatDateToYYYYMMDD(editingLeave.endDate),
        reason: editingLeave.reason
      })
    } else {
      form.reset({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: ""
      })
    }
  }, [editingLeave, form])

  const fetchDashboardData = async () => {
    try {
      const [leavesRes, attendanceRes] = await Promise.all([
        getMyLeaves(),
        getMyAttendance(),
        refreshUser()
      ])
      setLeaves(leavesRes.data.leaves)
      setAttendance(attendanceRes.data.attendance)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load dashboard data.")
    }
  }

  const onSubmitLeave = async (values: LeaveFormValues) => {
    try {
      const formattedValues = {
        ...values,
        startDate: formatDateToDDMMYYYY(values.startDate),
        endDate: formatDateToDDMMYYYY(values.endDate)
      }

      if (editingLeave) {
        await editLeave(editingLeave._id, formattedValues)
        toast.success("Leave updated successfully!")
      } else {
        await applyLeave(formattedValues as any)
        toast.success("Leave request submitted!")
      }
      setIsLeaveDialogOpen(false)
      setEditingLeave(null)
      fetchDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process leave request.")
    }
  }

  const handleDeleteLeave = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this leave request?")) return
    try {
      await cancelLeave(id)
      toast.success("Leave request cancelled.")
      fetchDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete request.")
    }
  }

  const handleMarkAttendance = async (status: string) => {
    try {
      await markAttendance({
        date: new Date().toISOString(),
        status
      })
      toast.success(`Attendance marked as ${status} for today!`)
      fetchDashboardData()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark attendance.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">Manage your leaves and attendance for the current cycle.</p>
      </header>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <CalendarIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.leaveBalance || 0} Days</div>
            <p className="text-xs text-muted-foreground mt-1">Remaining overall</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaves.filter(l => l.leaveType === 'sick' && l.status === 'approved').reduce((sum, l) => sum + l.totalDays, 0)} Days
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approved sick leaves</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Casual Leave</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaves.filter(l => l.leaveType === 'casual' && l.status === 'approved').reduce((sum, l) => sum + l.totalDays, 0)} Days
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approved casual leaves</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid Leave</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaves.filter(l => l.leaveType === 'paid' && l.status === 'approved').reduce((sum, l) => sum + l.totalDays, 0)} Days
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approved paid leaves</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="leaves" className="w-full mt-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="attendance">Attendance History</TabsTrigger>
        </TabsList>

        <TabsContent value="leaves" className="mt-6 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>My Leave Requests</CardTitle>
                <CardDescription>View status and history of your leave applications.</CardDescription>
              </div>
              <Dialog open={isLeaveDialogOpen} onOpenChange={(open) => {
                setIsLeaveDialogOpen(open)
                if (!open) setEditingLeave(null)
              }}>
                <DialogTrigger asChild>
                  <Button className="gap-2 w-full sm:w-auto"><Plus className="h-4 w-4" /> Apply Leave</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingLeave ? "Edit Leave Request" : "New Leave Request"}</DialogTitle>
                    <DialogDescription>Fill out the form below to apply for a leave.</DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitLeave)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="leaveType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Leave Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="sick">Sick</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason</FormLabel>
                            <FormControl>
                              <Input placeholder="Describe your reason..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit" className="w-full">
                          {editingLeave ? "Update Request" : "Submit Request"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaves.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">No leave requests found.</TableCell>
                      </TableRow>
                    ) : (
                      leaves.map((leave: any) => (
                        <TableRow key={leave._id}>
                          <TableCell className="font-medium capitalize">{leave.leaveType}</TableCell>
                          <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={leave.reason}>{leave.reason}</TableCell>
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
                            <div className="flex justify-end gap-2">
                              {leave.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEditingLeave(leave)
                                      setIsLeaveDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteLeave(leave._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Attendance Record</CardTitle>
                <CardDescription>Track your clock-ins and daily logs.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button onClick={() => handleMarkAttendance("present")} className="flex-1 sm:flex-none gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="h-4 w-4" /> Present
                </Button>
                <Button onClick={() => handleMarkAttendance("absent")} variant="destructive" className="flex-1 sm:flex-none gap-2">
                  <XCircle className="h-4 w-4" /> Absent
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">No attendance records found.</TableCell>
                      </TableRow>
                    ) : (
                      attendance.map((record: any) => (
                        <TableRow key={record._id}>
                          <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
