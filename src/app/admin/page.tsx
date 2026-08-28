'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DollarSign, Calendar, Users, ShoppingBag, Eye, TrendingUp, CalendarDays, Loader2 } from 'lucide-react';

interface ReportData {
  summary: {
    usersCount: number;
    petsCount: number;
    menuCount: number;
    reservationsCount: number;
    ordersCount: number;
    totalRevenue: number;
  };
  reservationsByDate: { date: string; count: number; attendees: number }[];
  salesByCategory: { category: string; value: number }[];
  petStatusData: { status: string; count: number }[];
}

export default function AdminDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(lastWeek);
  const [endDate, setEndDate] = useState(today);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== 'Admin') {
        router.push('/login');
        return;
      }

      const res = await fetch(`/api/reports?startDate=${startDate}&endDate=${endDate}`);
      if (res.ok) {
        const data = await res.json();
        setReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const COLORS = ['#5c4033', '#d4a373', '#e6ccb2', '#8ecae6', '#f28482'];

  if (loading && !report) {
    return (
      <div className="py-32 flex flex-col justify-center items-center gap-2 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
        <span className="text-xs font-semibold">Generating analytics report...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Management Console & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Date-filtered operational metrics, sales breakdowns, and pet allocation logs.</p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border">
            <CalendarDays className="w-4 h-4 text-accent" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-foreground font-semibold"
            />
            <span className="text-muted-foreground mx-1">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-foreground font-semibold"
            />
          </div>
        </div>
      </div>

      {report && (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-border space-y-1">
              <div className="flex justify-between items-center text-muted-foreground mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Revenue</span>
                <div className="p-2 bg-secondary text-primary rounded-xl"><DollarSign className="w-4 h-4" /></div>
              </div>
              <h3 className="text-2xl font-extrabold text-foreground">${report.summary.totalRevenue.toFixed(2)}</h3>
              <p className="text-[10px] text-muted-foreground">Completed order receipts</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-border space-y-1">
              <div className="flex justify-between items-center text-muted-foreground mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Sessions</span>
                <div className="p-2 bg-secondary text-primary rounded-xl"><Calendar className="w-4 h-4" /></div>
              </div>
              <h3 className="text-2xl font-extrabold text-foreground">{report.summary.reservationsCount}</h3>
              <p className="text-[10px] text-muted-foreground">Bookings in date range</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-border space-y-1">
              <div className="flex justify-between items-center text-muted-foreground mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
                <div className="p-2 bg-secondary text-primary rounded-xl"><Users className="w-4 h-4" /></div>
              </div>
              <h3 className="text-2xl font-extrabold text-foreground">{report.summary.usersCount}</h3>
              <p className="text-[10px] text-muted-foreground">Registered user profiles</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-border space-y-1">
              <div className="flex justify-between items-center text-muted-foreground mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">F&B Orders</span>
                <div className="p-2 bg-secondary text-primary rounded-xl"><ShoppingBag className="w-4 h-4" /></div>
              </div>
              <h3 className="text-2xl font-extrabold text-foreground">{report.summary.ordersCount}</h3>
              <p className="text-[10px] text-muted-foreground">Placed kitchen orders</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Trends Bar Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-border space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-accent" />
                <span>Session Booking & Attendance Trends</span>
              </h3>
              <div className="h-64 w-full text-xs">
                {report.reservationsByDate.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.reservationsByDate}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Reservations" fill="#5c4033" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="attendees" name="Total Guests" fill="#d4a373" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No booking data available for this range.
                  </div>
                )}
              </div>
            </div>

            {/* Menu Sales Category Pie Chart */}
            <div className="glass-panel p-6 rounded-2xl border border-border space-y-4 shadow-sm">
              <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                <ShoppingBag className="w-4.5 h-4.5 text-accent" />
                <span>F&B Sales by Menu Category ($)</span>
              </h3>
              <div className="h-64 w-full flex items-center justify-center text-xs">
                {report.salesByCategory.some(c => c.value > 0) ? (
                  <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around">
                    <div className="w-1/2 h-full min-h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={report.salesByCategory.filter(c => c.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            nameKey="category"
                          >
                            {report.salesByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Custom legend */}
                    <div className="space-y-2 flex-shrink-0">
                      {report.salesByCategory.map((c, index) => (
                        <div key={c.category} className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-semibold text-muted-foreground">{c.category}:</span>
                          <span className="font-bold text-foreground">${c.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">No menu item sales recorded in this range.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
