import React from 'react';
import { 
  HeartPulse, 
  UserCheck, 
  Calendar, 
  RefreshCw, 
  Activity, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  updatedTime: string;
  isLive: boolean;
  totalRecords: number;
  filteredRecords: number;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  updatedTime,
  isLive,
  totalRecords,
  filteredRecords,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm transition-all duration-300">
      {/* Rainbow Decorative Gradient Ribbon */}
      <div className="h-2.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 to-violet-500 animate-pulse-slow" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Main Title & Description */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-500 to-violet-600 text-white shadow-md shadow-rose-500/20">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase rounded-full bg-gradient-to-r from-rose-100 to-amber-100 text-rose-800 border border-rose-200/60">
                    Health Surveillance & Risk Analytics
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    เชื่อมโยงข้อมูลสำเร็จ
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                  รายงานพฤติกรรมโรคและปัจจัยเสี่ยง
                </h1>
              </div>
            </div>

            <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
              แดชบอร์ดติดตามข้อมูลคัดกรองสุขภาพชุมชน วิเคราะห์ความสัมพันธ์ระหว่างพฤติกรรมการใช้ชีวิต 
              ปัจจัยเสี่ยงต่อโรคไม่ติดต่อเรื้อรัง (NCDs) ภาวะเบาหวาน ความดันโลหิตสูง และประสิทธิผลของการออกกำลังกาย
            </p>

            {/* Author & Academic Credential */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 text-slate-800 border border-slate-200/80 font-medium">
                <UserCheck className="w-4 h-4 text-violet-600" />
                <span>ผู้จัดทำ:</span>
                <span className="font-semibold text-slate-900">นางสาวรอยมีย์ หมัดหลี</span>
                <span className="text-slate-500">| หลักสูตร วท.บ เวชระเบียน ปี 3</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                เวชระเบียนและการจัดการข้อมูลสุขภาพ
              </div>
            </div>
          </div>

          {/* Right Status Panel */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            {/* Timestamp & Refresh */}
            <div className="flex items-center gap-2">
              <div className="text-left lg:text-right">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>วันที่/เวลาที่อัปเดตข้อมูล</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-800">
                  {updatedTime}
                </div>
              </div>

              <button
                id="refresh-data-btn"
                onClick={onRefresh}
                disabled={isRefreshing}
                title="รีเฟรชข้อมูลคัดกรองล่าสุด"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200/60 focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Live Filter Indicator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 text-violet-800 border border-violet-200/60 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5 text-violet-600" />
                <span>แสดง {filteredRecords} จาก {totalRecords} รายการ</span>
              </div>
              {filteredRecords < totalRecords && (
                <span className="text-xs text-amber-600 font-medium flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  <ShieldAlert className="w-3 h-3" />
                  กำลังกรองข้อมูล
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
