import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, Clock, LogOut, Search, Download, Trash2,
  ChevronLeft, ChevronRight, GraduationCap, Filter, ChevronDown, ChevronUp,
  Mail, Phone, MapPin, Calendar, Building, BookOpen, User, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getStudents, deleteStudent, exportStudents } from '../../services/api';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import type { DashboardStats, StudentDocument } from '../../types';

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | boolean | number | undefined }) {
  const display = value === undefined || value === '' || value === false ? '—' : String(value);
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="w-3.5 h-3.5 text-outline shrink-0" />
      <span className="text-on-surface-variant shrink-0">{label}:</span>
      <span className="text-on-surface font-medium truncate">{display}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { admin, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [students, setStudents] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin/login');
  }, [isAuthenticated, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes] = await Promise.all([
        getDashboardStats(),
        getStudents({ page: String(page), search, limit: '10' }),
      ]);
      setStats(statsRes.data.data.stats);
      setStudents(studentsRes.data.data.students || []);
      setTotalPages(studentsRes.data.data.pagination?.totalPages || 1);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student? This cannot be undone.')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted permanently');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await exportStudents();
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `students-export-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export started');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  if (!isAuthenticated) return null;

  const statCards = [
    { label: 'Total Registrations', value: stats?.totalRegistrations ?? 0, icon: Users, color: 'text-primary', bg: 'bg-primary-container' },
    { label: 'Email Verified', value: stats?.verifiedUsers ?? 0, icon: UserCheck, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Pending Verification', value: stats?.pendingVerifications ?? 0, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-lg border-b border-outline-variant/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-on-surface">Admin Dashboard</h1>
                <p className="text-xs text-on-surface-variant">{admin?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleExport} loading={exporting} icon={<Download className="w-4 h-4" />}>
                Export CSV
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut className="w-4 h-4" />}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface-dim rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-on-surface-variant">{card.label}</p>
                    <p className="text-3xl font-bold text-on-surface mt-1">{card.value}</p>
                  </div>
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center`}>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-outline-variant/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  placeholder="Search by name, email, or mobile..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest"
                />
              </div>
              <Button variant="secondary" size="sm" icon={<Filter className="w-4 h-4" />}>
                Filter
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-container/50">
                  <th className="w-8 px-2" />
                  <th className="text-left px-3 py-3 font-medium text-on-surface-variant text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-3 py-3 font-medium text-on-surface-variant text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-3 py-3 font-medium text-on-surface-variant text-xs uppercase tracking-wider">Mobile</th>
                  <th className="text-left px-3 py-3 font-medium text-on-surface-variant text-xs uppercase tracking-wider">College</th>
                  <th className="text-left px-3 py-3 font-medium text-on-surface-variant text-xs uppercase tracking-wider">Course</th>
                  <th className="text-left px-3 py-3 font-medium text-on-surface-variant text-xs uppercase tracking-wider">Verified</th>
                  <th className="text-left px-3 py-3 font-medium text-on-surface-variant text-xs uppercase tracking-wider">Date</th>
                  <th className="text-right px-3 py-3 font-medium text-on-surface-variant text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-on-surface-variant">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-10">
                      <Users className="w-10 h-10 text-outline mx-auto mb-2" />
                      <p className="text-on-surface-variant">No students found</p>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <React.Fragment key={student._id}>
                      <tr className="border-t border-outline-variant/30 hover:bg-surface-container/30 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === student._id ? null : student._id)}>
                        <td className="px-2 py-3 text-center">
                          {expandedId === student._id ? <ChevronUp className="w-3.5 h-3.5 text-outline inline" /> : <ChevronDown className="w-3.5 h-3.5 text-outline inline" />}
                        </td>
                        <td className="px-3 py-3 font-medium text-on-surface">{student.fullName}</td>
                        <td className="px-3 py-3 text-on-surface-variant text-xs">{student.email}</td>
                        <td className="px-3 py-3 text-on-surface-variant">{student.mobileNumber}</td>
                        <td className="px-3 py-3 text-on-surface-variant text-xs max-w-[120px] truncate">{student.collegeName || '—'}</td>
                        <td className="px-3 py-3 text-on-surface-variant text-xs">{student.courseName || '—'}</td>
                        <td className="px-3 py-3">
                          {student.emailVerified ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success text-xs rounded-full font-medium">
                              <span className="w-1.5 h-1.5 bg-success rounded-full" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full font-medium">
                              <span className="w-1.5 h-1.5 bg-warning rounded-full" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-on-surface-variant text-xs whitespace-nowrap">
                          {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(student._id); }}
                            className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error/10 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {expandedId === student._id && (
                          <motion.tr
                            key={`${student._id}-details`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <td colSpan={9} className="bg-surface-container/20 px-4 sm:px-6 py-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Personal</p>
                                  <DetailRow icon={User} label="Gender" value={student.gender} />
                                  <DetailRow icon={Calendar} label="DOB" value={student.dateOfBirth} />
                                  <DetailRow icon={Phone} label="WhatsApp" value={student.whatsappNumber} />
                                  <DetailRow icon={MapPin} label="Address" value={student.address} />
                                  <DetailRow icon={MapPin} label="City" value={student.city} />
                                  <DetailRow icon={MapPin} label="State" value={student.state} />
                                  <DetailRow icon={MapPin} label="Pincode" value={student.pincode} />
                                </div>
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Education</p>
                                  <DetailRow icon={Building} label="College" value={student.collegeName} />
                                  <DetailRow icon={BookOpen} label="Course" value={student.courseName} />
                                  <DetailRow icon={BookOpen} label="Branch" value={student.branch} />
                                  <DetailRow icon={GraduationCap} label="Current Year" value={student.currentYear} />
                                  <DetailRow icon={GraduationCap} label="Grad Year" value={student.graduationYear} />
                                </div>
                                <div className="space-y-2">
                                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Social & Referral</p>
                                  <DetailRow icon={Globe} label="LinkedIn" value={student.linkedIn} />
                                  <DetailRow icon={Globe} label="GitHub" value={student.github} />
                                  <DetailRow icon={Globe} label="Instagram" value={student.instagram} />
                                  <DetailRow icon={User} label="How Heard" value={student.howHeard} />
                                  <DetailRow icon={User} label="Referral Code" value={student.referralCode} />
                                  <DetailRow icon={User} label="Referred By" value={student.referredBy} />
                                  <DetailRow icon={Mail} label="Subscribe" value={student.subscribe ? 'Yes' : 'No'} />
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-outline-variant/50">
              <p className="text-xs text-on-surface-variant">Page {page} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg hover:bg-surface-container disabled:opacity-30 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg hover:bg-surface-container disabled:opacity-30 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
