import React from 'react';
import { HealthStats } from '../utils/analytics';
import { 
  Users, 
  Weight, 
  Droplet, 
  Activity, 
  AlertOctagon, 
  HeartHandshake, 
  TrendingUp, 
  TrendingDown,
  Percent
} from 'lucide-react';

interface KpiCardsProps {
  stats: HealthStats;
  totalFiltered: number;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1.5 rounded-full bg-gradient-to-b from-rose-500 to-amber-500" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            สรุปข้อมูลสำคัญด้านสุขภาพ (Health Overview KPIs)
          </h2>
        </div>
        <span className="text-xs text-slate-500">
          คำนวณจากข้อมูลคัดกรอง {stats.total} ราย
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* KPI 1: จำนวนประชากรคัดกรอง (Count & Demographics) */}
        <div className="group relative rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ประชากรคัดกรองทั้งหมด
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stats.total}
                </span>
                <span className="text-sm font-medium text-slate-500">ราย</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 rounded-lg p-2">
              <span className="text-slate-500 block text-[11px]">อายุเฉลี่ย</span>
              <span className="font-bold text-slate-800">{stats.avgAge} ปี</span>
            </div>
            <div className="bg-violet-50/60 rounded-lg p-2">
              <span className="text-violet-700 block text-[11px]">สัดส่วนกลุ่มเสี่ยงสูง</span>
              <span className="font-bold text-violet-900">{stats.highRiskCount} ราย ({stats.highRiskPct}%)</span>
            </div>
          </div>
        </div>

        {/* KPI 2: ค่าเฉลี่ยและช่วง BMI (Average, Min, Max) */}
        <div className="group relative rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-teal-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ดัชนีมวลกายเฉลี่ย (BMI)
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-cyan-900 tracking-tight">
                  {stats.avgBmi}
                </span>
                <span className="text-sm font-medium text-slate-500">kg/m²</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 group-hover:scale-105 transition-transform">
              <Weight className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
              <span>ต่ำสุด: <strong className="text-slate-800">{stats.minBmi}</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 text-slate-600">
              <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
              <span>สูงสุด: <strong className="text-slate-800">{stats.maxBmi}</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              {stats.avgBmi >= 25 ? 'เกณฑ์อ้วน' : stats.avgBmi >= 23 ? 'น้ำหนักเกิน' : 'สมส่วน'}
            </span>
          </div>
        </div>

        {/* KPI 3: ค่าเฉลี่ยและช่วงระดับน้ำตาล (Blood Sugar Mean, Min, Max) */}
        <div className="group relative rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ระดับน้ำตาลในเลือดเฉลี่ย
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-900 tracking-tight">
                  {stats.avgSugar}
                </span>
                <span className="text-sm font-medium text-slate-500">mg/dL</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:scale-105 transition-transform">
              <Droplet className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>ต่ำสุด: <strong className="text-slate-800">{stats.minSugar}</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 text-slate-600">
              <span>สูงสุด: <strong className="text-rose-600">{stats.maxSugar}</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-200" />
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              เสี่ยงเบาหวาน {stats.diabetesRiskPct}%
            </span>
          </div>
        </div>

        {/* KPI 4: ค่าเฉลี่ยความดันโลหิต (SBP & DBP) */}
        <div className="group relative rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ความดันโลหิตเฉลี่ย (SBP / DBP)
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-900 tracking-tight">
                  {stats.avgSbp}
                </span>
                <span className="text-base font-bold text-slate-400">/</span>
                <span className="text-2xl font-bold text-slate-700">
                  {stats.avgDbp}
                </span>
                <span className="text-sm font-medium text-slate-500">mmHg</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              ช่วง SBP: <strong>{stats.minSbp} - {stats.maxSbp}</strong> mmHg
            </span>
            <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              เสี่ยงความดัน {stats.hypertensionRiskPct}%
            </span>
          </div>
        </div>

        {/* KPI 5: ร้อยละและสัดส่วนกลุ่มความเสี่ยงสูง (High Risk Percentage) */}
        <div className="group relative rounded-2xl p-5 bg-white border border-rose-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                ร้อยละกลุ่มเสี่ยงสูง (High Risk)
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-rose-600 tracking-tight">
                  {stats.highRiskPct}%
                </span>
                <span className="text-sm font-semibold text-rose-700">
                  ({stats.highRiskCount} จาก {stats.total} ราย)
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 group-hover:scale-105 transition-transform">
              <Percent className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-amber-50 rounded-lg p-2 text-center">
              <span className="text-amber-700 block text-[11px]">เสี่ยงปานกลาง</span>
              <span className="font-bold text-amber-900">{stats.medRiskCount} ราย ({stats.medRiskPct}%)</span>
            </div>
            <div className="bg-emerald-50 rounded-lg p-2 text-center">
              <span className="text-emerald-700 block text-[11px]">เสี่ยงต่ำ</span>
              <span className="font-bold text-emerald-900">{stats.lowRiskCount} ราย ({stats.lowRiskPct}%)</span>
            </div>
          </div>
        </div>

        {/* KPI 6: สัดส่วนพฤติกรรมเสี่ยง (Behavioral Risk Ratios) */}
        <div className="group relative rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                สัดส่วนพฤติกรรมเสี่ยงหลัก
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-900 tracking-tight">
                  {stats.noExercisePct}%
                </span>
                <span className="text-sm font-medium text-slate-500">ไม่ออกกำลังกาย</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="bg-slate-50 rounded-lg p-1.5">
              <span className="text-slate-500 block text-[10px]">สูบบุหรี่</span>
              <span className="font-bold text-slate-800">{stats.smokingPct}%</span>
            </div>
            <div className="bg-slate-50 rounded-lg p-1.5">
              <span className="text-slate-500 block text-[10px]">ดื่มแอลกอฮอล์</span>
              <span className="font-bold text-slate-800">{stats.alcoholPct}%</span>
            </div>
            <div className="bg-emerald-50 rounded-lg p-1.5">
              <span className="text-emerald-700 block text-[10px]">ออกสม่ำเสมอ</span>
              <span className="font-bold text-emerald-800">{stats.regularExercisePct}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
