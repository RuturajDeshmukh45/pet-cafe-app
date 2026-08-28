'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2 } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  timestamp: string;
  user: { name: string; email: string } | null;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLogs = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const meData = await meRes.json();
      if (!meData.user || meData.user.role !== 'Admin') {
        router.push('/login');
        return;
      }

      const res = await fetch('/api/audit');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.auditLogs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-foreground">System Audit Logs</h1>
        <p className="text-sm text-muted-foreground">Trace administrative actions and configuration changes across the application.</p>
      </div>

      <div className="glass-panel rounded-2xl border border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="min-w-full divide-y divide-border text-left">
            <thead className="bg-muted/50 text-xs font-bold text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Entity Type</th>
                <th className="px-6 py-4">Entity Reference ID</th>
                <th className="px-6 py-4">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground text-xs">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{log.action}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-secondary text-secondary-foreground font-bold rounded text-[10px]">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">{log.entityId || '—'}</td>
                    <td className="px-6 py-4">
                      {log.user ? (
                        <div>
                          <div className="font-semibold">{log.user.name}</div>
                          <div className="text-[10px] text-muted-foreground">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">System / Guest</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No system audit logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
