/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { HealthRecord, FilterState, TabSection } from './types';
import { INITIAL_HEALTH_RECORDS, fetchSheetData } from './data/initialData';
import { calculateHealthStats } from './utils/analytics';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { Navigation } from './components/Navigation';
import { KpiCards } from './components/KpiCards';
import { HealthRiskSection } from './components/HealthRiskSection';
import { HealthTrendSection } from './components/HealthTrendSection';
import { HealthBehaviorSection } from './components/HealthBehaviorSection';
import { CorrelationSection } from './components/CorrelationSection';
import { DetailTableView } from './components/DetailTableView';
import { 
  HeartPulse, 
  Sparkles, 
  UserCheck, 
  ArrowUp,
  LayoutGrid,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [isLive, setIsLive] = useState(false);
  const [updatedTime, setUpdatedTime] = useState('31 มีนาคม 2026 (16:30 น.)');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabSection>('overview');
  const [viewMode, setViewMode] = useState<'tabbed' | 'all'>('tabbed');

  const [filters, setFilters] = useState<FilterState>({
    smoking: 'ทั้งหมด',
    alcohol: 'ทั้งหมด',
    exercise: 'ทั้งหมด',
    diabetesRisk: 'ทั้งหมด',
    hypertensionRisk: 'ทั้งหมด',
    area: 'ทั้งหมด',
    gender: 'ทั้งหมด',
    riskLevel: 'ทั้งหมด',
    searchQuery: '',
  });

  // Attempt live sync on mount
  useEffect(() => {
    let mounted = true;
    fetchSheetData().then((res) => {
      if (mounted && res.records.length > 0) {
        setRecords(res.records);
        setIsLive(res.isLive);
        setUpdatedTime(res.updatedTime);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    const res = await fetchSheetData();
    if (res.records.length > 0) {
      setRecords(res.records);
      setIsLive(res.isLive);
      setUpdatedTime(res.updatedTime);
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      smoking: 'ทั้งหมด',
      alcohol: 'ทั้งหมด',
      exercise: 'ทั้งหมด',
      diabetesRisk: 'ทั้งหมด',
      hypertensionRisk: 'ทั้งหมด',
      area: 'ทั้งหมด',
      gender: 'ทั้งหมด',
      riskLevel: 'ทั้งหมด',
      searchQuery: '',
    });
  };

  // Filter calculation
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filters.smoking !== 'ทั้งหมด' && r.smoking !== filters.smoking) return false;
      if (filters.alcohol !== 'ทั้งหมด' && r.alcohol !== filters.alcohol) return false;
      if (filters.exercise !== 'ทั้งหมด' && r.exercise !== filters.exercise) return false;
      if (filters.diabetesRisk !== 'ทั้งหมด' && r.diabetesRisk !== filters.diabetesRisk) return false;
      if (filters.hypertensionRisk !== 'ทั้งหมด' && r.hypertensionRisk !== filters.hypertensionRisk) return false;
      if (filters.area !== 'ทั้งหมด' && r.area !== filters.area) return false;
      if (filters.gender !== 'ทั้งหมด' && r.gender !== filters.gender) return false;
      if (filters.riskLevel !== 'ทั้งหมด' && r.riskLevel !== filters.riskLevel) return false;

      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const match =
          r.id.toLowerCase().includes(q) ||
          r.area.toLowerCase().includes(q) ||
          r.gender.toLowerCase().includes(q) ||
          String(r.age).includes(q) ||
          r.exercise.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [records, filters]);

  // Active filters count
  const activeCount = useMemo(() => {
    let c = 0;
    if (filters.smoking !== 'ทั้งหมด') c++;
    if (filters.alcohol !== 'ทั้งหมด') c++;
    if (filters.exercise !== 'ทั้งหมด') c++;
    if (filters.diabetesRisk !== 'ทั้งหมด') c++;
    if (filters.hypertensionRisk !== 'ทั้งหมด') c++;
    if (filters.area !== 'ทั้งหมด') c++;
    if (filters.gender !== 'ทั้งหมด') c++;
    if (filters.riskLevel !== 'ทั้งหมด') c++;
    if (filters.searchQuery.trim()) c++;
    return c;
  }, [filters]);

  // Calculated statistics
  const stats = useMemo(() => {
    return calculateHealthStats(filteredRecords);
  }, [filteredRecords]);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 via-sky-50/20 to-violet-50/20 text-slate-800 pb-16">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* 1. Header with Author, Date/Time, and Live Refresh (No link shown) */}
        <Header
          updatedTime={updatedTime}
          isLive={isLive}
          totalRecords={records.length}
          filteredRecords={filteredRecords.length}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* 2. Mandatory Filters Section */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          activeCount={activeCount}
        />

        {/* View Mode Switcher & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Navigation
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              if (viewMode === 'all') {
                const el = document.getElementById(`section-${tab}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode(viewMode === 'tabbed' ? 'all' : 'tabbed')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:bg-slate-50 text-slate-700 transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-violet-600" />
              <span>{viewMode === 'tabbed' ? 'แสดงทุกส่วนพร้อมกัน' : 'สลับโหมดแท็บ'}</span>
            </button>
          </div>
        </div>

        {/* Tabbed or Full View Content */}
        {viewMode === 'tabbed' ? (
          <main className="space-y-6 min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <KpiCards stats={stats} totalFiltered={filteredRecords.length} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HealthRiskSection records={filteredRecords} />
                  <HealthBehaviorSection records={filteredRecords} />
                </div>
              </div>
            )}

            {activeTab === 'risk' && (
              <div className="animate-in fade-in duration-200">
                <HealthRiskSection records={filteredRecords} />
              </div>
            )}

            {activeTab === 'trend' && (
              <div className="animate-in fade-in duration-200">
                <HealthTrendSection records={filteredRecords} />
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="animate-in fade-in duration-200">
                <HealthBehaviorSection records={filteredRecords} />
              </div>
            )}

            {activeTab === 'correlation' && (
              <div className="animate-in fade-in duration-200">
                <CorrelationSection records={filteredRecords} />
              </div>
            )}

            {activeTab === 'table' && (
              <div className="animate-in fade-in duration-200">
                <DetailTableView records={filteredRecords} />
              </div>
            )}
          </main>
        ) : (
          /* All Sections Stacked View */
          <main className="space-y-10 animate-in fade-in duration-200">
            <div id="section-overview">
              <KpiCards stats={stats} totalFiltered={filteredRecords.length} />
            </div>

            <div id="section-risk">
              <HealthRiskSection records={filteredRecords} />
            </div>

            <div id="section-trend">
              <HealthTrendSection records={filteredRecords} />
            </div>

            <div id="section-behavior">
              <HealthBehaviorSection records={filteredRecords} />
            </div>

            <div id="section-correlation">
              <CorrelationSection records={filteredRecords} />
            </div>

            <div id="section-table">
              <DetailTableView records={filteredRecords} />
            </div>
          </main>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 text-white">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <span>
              รายงานสรุปผลคัดกรองสุขภาพ • โครงการวิเคราะห์สารสนเทศสุขภาพชุมชน
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <UserCheck className="w-4 h-4 text-violet-600" />
              <span>นางสาวรอยมีย์ หมัดหลี วท.บ เวชระเบียน ปี 3</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs transition-colors"
              title="เลื่อนขึ้นด้านบน"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
