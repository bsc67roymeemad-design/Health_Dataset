import React from 'react';
import { FilterState } from '../types';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Cigarette, 
  Wine, 
  Dumbbell, 
  Activity, 
  Gauge, 
  MapPin, 
  ShieldAlert
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
  activeCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  activeCount,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs p-5 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-sm">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              ระบบตัวกรองข้อมูลคัดกรอง (Control Filters)
              {activeCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                  {activeCount} ตัวกรองทำงานอยู่
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">
              กรองเจาะจงกลุ่มพฤติกรรมและระดับความเสี่ยงเพื่อวิเคราะห์ข้อมูลแบบจำเพาะ
            </p>
          </div>
        </div>

        {/* Quick Search & Reset */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-filter-input"
              type="text"
              placeholder="ค้นหารหัส เช่น H0001, อายุ, พื้นที่..."
              value={filters.searchQuery}
              onChange={(e) => onChange('searchQuery', e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all"
            />
          </div>

          {activeCount > 0 && (
            <button
              id="reset-filter-btn"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 5 Mandatory Filters + Geographic & Risk Helpers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
        {/* 1. สูบบุหรี่ */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Cigarette className="w-3.5 h-3.5 text-rose-500" />
            <span>สูบบุหรี่</span>
          </label>
          <select
            id="filter-smoking"
            value={filters.smoking}
            onChange={(e) => onChange('smoking', e.target.value)}
            className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 ${
              filters.smoking !== 'ทั้งหมด'
                ? 'bg-rose-50/70 border-rose-300 text-rose-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <option value="ทั้งหมด">ทั้งหมด (สูบ/ไม่สูบ)</option>
            <option value="สูบ">สูบ</option>
            <option value="ไม่สูบ">ไม่สูบ</option>
          </select>
        </div>

        {/* 2. ดื่มแอลกอฮอล์ */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Wine className="w-3.5 h-3.5 text-amber-500" />
            <span>ดื่มแอลกอฮอล์</span>
          </label>
          <select
            id="filter-alcohol"
            value={filters.alcohol}
            onChange={(e) => onChange('alcohol', e.target.value)}
            className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              filters.alcohol !== 'ทั้งหมด'
                ? 'bg-amber-50/70 border-amber-300 text-amber-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <option value="ทั้งหมด">ทั้งหมด (ดื่ม/ไม่ดื่ม)</option>
            <option value="ดื่ม">ดื่ม</option>
            <option value="ไม่ดื่ม">ไม่ดื่ม</option>
          </select>
        </div>

        {/* 3. การออกกำลังกาย */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
            <span>การออกกำลังกาย</span>
          </label>
          <select
            id="filter-exercise"
            value={filters.exercise}
            onChange={(e) => onChange('exercise', e.target.value)}
            className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              filters.exercise !== 'ทั้งหมด'
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="สม่ำเสมอ">สม่ำเสมอ</option>
            <option value="บางครั้ง">บางครั้ง</option>
            <option value="ไม่ออกกำลังกาย">ไม่ออกกำลังกาย</option>
          </select>
        </div>

        {/* 4. เบาหวาน_คัดกรอง */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span>เบาหวาน_คัดกรอง</span>
          </label>
          <select
            id="filter-diabetes"
            value={filters.diabetesRisk}
            onChange={(e) => onChange('diabetesRisk', e.target.value)}
            className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
              filters.diabetesRisk !== 'ทั้งหมด'
                ? 'bg-cyan-50/70 border-cyan-300 text-cyan-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ไม่มี">ไม่มี</option>
            <option value="มีแนวโน้ม/เสี่ยง">มีแนวโน้ม/เสี่ยง</option>
          </select>
        </div>

        {/* 5. ความดันโลหิตสูง_คัดกรอง */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-violet-500" />
            <span>ความดันโลหิตสูง_คัดกรอง</span>
          </label>
          <select
            id="filter-hypertension"
            value={filters.hypertensionRisk}
            onChange={(e) => onChange('hypertensionRisk', e.target.value)}
            className={`w-full px-3 py-2 text-xs sm:text-sm rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 ${
              filters.hypertensionRisk !== 'ทั้งหมด'
                ? 'bg-violet-50/70 border-violet-300 text-violet-800 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
            }`}
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ไม่มี">ไม่มี</option>
            <option value="มีแนวโน้ม/เสี่ยง">มีแนวโน้ม/เสี่ยง</option>
          </select>
        </div>
      </div>

      {/* Secondary Companion Filters (Area, Risk Level) */}
      <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          ตัวกรองเพิ่มเติม:
        </span>

        {/* พื้นที่ */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">พื้นที่:</span>
          <select
            id="filter-area"
            value={filters.area}
            onChange={(e) => onChange('area', e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
          >
            <option value="ทั้งหมด">ทั้งหมด (5 พื้นที่)</option>
            <option value="เมือง">เมือง</option>
            <option value="เหนือ">เหนือ</option>
            <option value="ตะวันออก">ตะวันออก</option>
            <option value="ตะวันตก">ตะวันตก</option>
            <option value="ใต้">ใต้</option>
          </select>
        </div>

        {/* ระดับความเสี่ยง */}
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">ระดับความเสี่ยง:</span>
          <select
            id="filter-risklevel"
            value={filters.riskLevel}
            onChange={(e) => onChange('riskLevel', e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
          >
            <option value="ทั้งหมด">ทั้งหมด</option>
            <option value="ต่ำ">ต่ำ</option>
            <option value="ปานกลาง">ปานกลาง</option>
            <option value="สูง">สูง</option>
          </select>
        </div>

        {/* เพศ */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-600 font-medium">เพศ:</span>
          <select
            id="filter-gender"
            value={filters.gender}
            onChange={(e) => onChange('gender', e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
          >
            <option value="ทั้งหมด">ทุกเพศ</option>
            <option value="ชาย">ชาย</option>
            <option value="หญิง">หญิง</option>
          </select>
        </div>
      </div>
    </div>
  );
};
