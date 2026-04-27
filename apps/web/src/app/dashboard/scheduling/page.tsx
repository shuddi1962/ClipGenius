'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Globe
} from 'lucide-react'
import insforge from '@/lib/insforge'

interface Appointment {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  serviceType: string
  date: string
  time: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  createdAt: string
}

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  isActive: boolean
}

export default function SchedulingPage() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'calendar' | 'services' | 'settings'>('appointments')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // New appointment form
  const [showNewForm, setShowNewForm] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: '',
    date: '',
    time: '',
    notes: ''
  })

  useEffect(() => {
    if (activeTab === 'appointments' || activeTab === 'calendar') {
      fetchAppointments()
    }
    if (activeTab === 'services') {
      fetchServices()
    }
  }, [activeTab])

  const fetchAppointments = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { data, error } = await insforge
        .from('appointments')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('date', { ascending: false })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { data, error } = await insforge
        .from('appointment_services')
        .select('*')
        .eq('workspace_id', workspace.id)
        .order('name', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const createAppointment = async () => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const selectedService = services.find(s => s.id === newAppointment.serviceType)
      const duration = selectedService?.duration || 60

      const { error } = await insforge
        .from('appointments')
        .insert({
          workspace_id: workspace.id,
          customer_name: newAppointment.customerName,
          customer_email: newAppointment.customerEmail,
          customer_phone: newAppointment.customerPhone,
          service_type: newAppointment.serviceType,
          date: newAppointment.date,
          time: newAppointment.time,
          duration,
          status: 'scheduled',
          notes: newAppointment.notes
        })

      if (error) throw error

      alert('Appointment scheduled successfully!')
      setShowNewForm(false)
      setNewAppointment({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceType: '',
        date: '',
        time: '',
        notes: ''
      })
      fetchAppointments()
    } catch (error) {
      console.error('Error creating appointment:', error)
      alert('Failed to schedule appointment')
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    try {
      const { error } = await insforge
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)

      if (error) throw error

      setAppointments(appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status } : apt
      ))
    } catch (error) {
      console.error('Error updating appointment:', error)
      alert('Failed to update appointment status')
    }
  }

  const deleteAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    try {
      const { error } = await insforge
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

      if (error) throw error

      setAppointments(appointments.filter(apt => apt.id !== appointmentId))
    } catch (error) {
      console.error('Error deleting appointment:', error)
      alert('Failed to delete appointment')
    }
  }

  const createService = async (serviceData: Omit<Service, 'id'>) => {
    try {
      const { data: userData } = await insforge.auth.getUser()
      if (!userData?.user) return

      const { data: workspace } = await insforge
        .from('workspaces')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()

      if (!workspace) return

      const { error } = await insforge
        .from('appointment_services')
        .insert({
          workspace_id: workspace.id,
          ...serviceData
        })

      if (error) throw error

      fetchServices()
    } catch (error) {
      console.error('Error creating service:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed': return 'bg-green-500/20 text-green-400'
      case 'scheduled': return 'bg-blue-500/20 text-blue-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      case 'no-show': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date)
  }

  const tabs = [
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'calendar', name: 'Calendar View', icon: Clock },
    { id: 'services', name: 'Services', icon: Settings },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F5FF]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Online Scheduling</h1>
          <p className="text-gray-300">Book appointments and manage your schedule</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <Globe className="w-4 h-4 mr-2" />
            Booking Page
          </Button>
          <Button onClick={() => setShowNewForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm border border-gray-700/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#00F5FF]/20 to-[#FFB800]/20 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          {/* Appointments Table */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Scheduled Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Service</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date & Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                        <td className="py-4 px-4">
                          <div className="text-white font-medium">{appointment.customerName}</div>
                          <div className="text-gray-400 text-sm">{appointment.customerEmail}</div>
                          {appointment.customerPhone && (
                            <div className="text-gray-400 text-sm">{appointment.customerPhone}</div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-300">{appointment.serviceType}</td>
                        <td className="py-4 px-4 text-gray-300">
                          <div>{new Date(appointment.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-400">{appointment.time} ({appointment.duration}min)</div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            {appointment.status === 'scheduled' && (
                              <Button
                                onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Confirm
                              </Button>
                            )}
                            {appointment.status === 'confirmed' && (
                              <Button
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                Complete
                              </Button>
                            )}
                            <Button
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => deleteAppointment(appointment.id)}
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Calendar View</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                Today
              </Button>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white w-40"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getAppointmentsForDate(selectedDate).map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-[#00F5FF]" />
                          <div>
                            <div className="text-white font-medium">{appointment.customerName}</div>
                            <div className="text-gray-400 text-sm">{appointment.serviceType}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="text-gray-300 text-sm">
                        {appointment.time} - {appointment.duration} minutes
                      </div>
                    </div>
                  ))}

                  {getAppointmentsForDate(selectedDate).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No appointments scheduled for this date</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">Total Appointments</span>
                    <span className="text-white font-medium">{getAppointmentsForDate(selectedDate).length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">Confirmed</span>
                    <span className="text-green-400 font-medium">
                      {getAppointmentsForDate(selectedDate).filter(a => a.status === 'confirmed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-300">Pending</span>
                    <span className="text-yellow-400 font-medium">
                      {getAppointmentsForDate(selectedDate).filter(a => a.status === 'scheduled').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Available Services</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">{service.name}</h3>
                    <Badge className={service.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-300">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {service.duration} min
                    </div>
                    <div className="text-green-400 font-medium">
                      ${service.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {services.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Settings className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No services configured</h3>
                <p className="text-gray-400 mb-6">
                  Add services that customers can book appointments for
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Service
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Booking Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Public Booking URL
                </label>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <code className="text-green-400">
                    https://clipgenius.com/book/YOUR_WORKSPACE_ID
                  </code>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Share this URL with customers to allow self-booking
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Hours
                  </label>
                  <div className="space-y-2">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked={day !== 'Sunday'} className="rounded" />
                        <span className="text-gray-300 text-sm w-20">{day}</span>
                        <Input
                          defaultValue={day === 'Saturday' ? '9:00 AM - 2:00 PM' : '9:00 AM - 5:00 PM'}
                          className="bg-gray-600 border-gray-500 text-white text-sm flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Booking Restrictions
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Advance Booking (days)</label>
                      <Input
                        type="number"
                        defaultValue="30"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Cancellation Notice (hours)</label>
                      <Input
                        type="number"
                        defaultValue="24"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <label className="text-sm text-gray-300">Require phone confirmation</label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Schedule New Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customer Name
                  </label>
                  <Input
                    value={newAppointment.customerName}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, customerName: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Customer Email
                  </label>
                  <Input
                    type="email"
                    value={newAppointment.customerEmail}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, customerEmail: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customer Phone (Optional)
                </label>
                <Input
                  value={newAppointment.customerPhone}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Service Type
                  </label>
                  <select
                    value={newAppointment.serviceType}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, serviceType: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-[#00F5FF] focus:ring-[#00F5FF]"
                  >
                    <option value="">Select a service</option>
                    {services.filter(s => s.isActive).map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name} (${service.price} - {service.duration}min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Appointment Date
                  </label>
                  <Input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Appointment Time
                </label>
                <Input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-[#00F5FF] focus:ring-[#00F5FF] min-h-[80px] resize-none"
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => setShowNewForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createAppointment} disabled={!newAppointment.customerName || !newAppointment.customerEmail || !newAppointment.serviceType || !newAppointment.date || !newAppointment.time} className="bg-blue-600 hover:bg-blue-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}