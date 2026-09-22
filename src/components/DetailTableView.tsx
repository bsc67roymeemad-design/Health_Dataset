import React, { useState } from 'react';
import { HealthRecord } from '../types';
import { 
  TableProperties, 
  Search, 
  ArrowUpDown, 
  Download, 
  Eye, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Dumbbell, 
  Cigarette, 
  Wine,
  User,
  Activity,
  Heart
} from 'lucide-react';

interface DetailTableViewProps {
  records: HealthRecord[];
}

export const DetailTableView: React.FC<DetailTableViewProps> = ({ records }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof HealthRecord>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const pageSize = 10;

  // Filter records by search
  const filtered = records.filter(r => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.id.toLowerCase().includes(term) ||
      r.area.toLowerCase().includes(term) ||
      r.gender.toLowerCase().includes(term) ||
      String(r.age).includes(term) ||
      r.exercise.toLowerCase().includes(term) ||
      r.riskLevel.toLowerCase().includes(term)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc 
      ? String(valA).localeCompare(String(valB), 'th') 
      : String(valB).localeCompare(String(valA), 'th');
  });

  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: keyof HealthRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'รหัสบุคคล',
      'วันที่คัดกรอง',
      'พื้นที่',
      'เพศ',
      'อายุ',
      'ส่วนสูง_cm',
      'น้ำหนัก_kg',
      'BMI',
      'SBP_mmHg',
      'DBP_mmHg',
      'ชีพจร_bpm',
      'น้ำตาล_mg_dL',
      'สูบบุหรี่',
      'ดื่มแอลกอฮอล์',
      'การออกกำลังกาย',
      'เบาหวาน_คัดกรอง',
      'ความดันโลหิตสูง_คัดกรอง',
      'คะแนนความเสี่ยง',
      'ระดับความเสี่ยง',
      'เดือน'
    ];

    const rows = sorted.map(r => [
      r.id,
      r.screenDate,
      r.area,
      r.gender,
      r.age,
      r.heightCm,
      r.weightKg,
      r.bmi,
      r.sbp,
      r.dbp,
      r.pulse,
      r.bloodSugar,
      r.smoking,
      r.alcohol,
      r.exercise,
      r.diabetesRisk,
      r.hypertensionRisk,
      r.riskScore,
      r.riskLevel,
      r.month
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `health_risk_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lifestyle & Exercise Impact badge helper
  const getExerciseImpactNote = (r: HealthRecord) => {
    if (r.exercise === 'สม่ำเสมอ') {
      return {
        badge: 'ผลดีเยี่ยม',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        detail: 'ควบคุมน้ำตาลและความดันได้ดี ปลอดความเสี่ยงสูง'
      };
    }
    if (r.exercise === 'บางครั้ง') {
      return {
        badge: 'ผลปานกลาง',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        detail: 'ช่วยชะลอความดันโลหิตสูง แต่ควรเพิ่มความสม่ำเสมอ'
      };
    }
    return {
      badge: 'เสี่ยงจากการไม่ออกกำลัง',
      color: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
      detail: 'พบร่วมกับระดับน้ำตาลและ SBP สูง และคะแนนความเสี่ยงสูง'
    };
  };

  return (
    <section className="space-y-4">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
            <TableProperties className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              รายละเอียดข้อมูลเชิงลึก (Data Table / Detail View)
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์พฤติกรรมสุขภาพ ความเชื่อมโยงของไลฟ์สไตล์กับความเสี่ยง และผลกระทบของการออกกำลังกาย
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาในตาราง..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 w-48 sm:w-56"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-200 transition-colors"
            title="ส่งออกตารางเป็นไฟล์ CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ส่งออก CSV</span>
          </button>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 select-none">
                <th 
                  onClick={() => handleSort('id')} 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>รหัสบุคคล</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">พื้นที่ / วันที่</th>
                <th 
                  onClick={() => handleSort('age')} 
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>เพศ / อายุ</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('bmi')} 
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>BMI (kg/m²)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('sbp')} 
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>SBP / DBP</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('bloodSugar')} 
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>น้ำตาล (mg/dL)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">พฤติกรรม (สูบ/ดื่ม)</th>
                <th className="py-3 px-3">การออกกำลังกาย</th>
                <th className="py-3 px-3">ผลกระทบของไลฟ์สไตล์</th>
                <th 
                  onClick={() => handleSort('riskScore')} 
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>ระดับความเสี่ยง</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">ดูข้อมูล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0 ? (
                paginated.map((r) => {
                  const impact = getExerciseImpactNote(r);
                  return (
                    <tr 
                      key={r.id} 
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedRecord(r)}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {r.id}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <span className="font-semibold text-slate-800">{r.area}</span>
                        <span className="block text-[10px] text-slate-400">{r.screenDate}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-800">{r.gender}</span>
                        <span className="text-slate-500 ml-1">({r.age} ปี)</span>
                      </td>

                      {/* BMI with color badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                          r.bmi >= 25 
                            ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                            : r.bmi >= 23 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {r.bmi}
                        </span>
                      </td>

                      {/* SBP/DBP with color badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-xs ${
                          r.sbp >= 140 
                            ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' 
                            : r.sbp >= 120 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {r.sbp}/{r.dbp}
                        </span>
                      </td>

                      {/* Blood sugar with color badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-xs ${
                          r.bloodSugar >= 126 
                            ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200' 
                            : r.bloodSugar >= 100 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {r.bloodSugar}
                        </span>
                      </td>

                      {/* Smoking & Alcohol */}
                      <td className="py-3 px-3 text-slate-700">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <span className={r.smoking === 'สูบ' ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                            {r.smoking === 'สูบ' ? 'สูบ' : 'ไม่สูบ'}
                          </span>
                          <span>/</span>
                          <span className={r.alcohol === 'ดื่ม' ? 'text-amber-600 font-bold' : 'text-slate-400'}>
                            {r.alcohol === 'ดื่ม' ? 'ดื่ม' : 'ไม่ดื่ม'}
                          </span>
                        </div>
                      </td>

                      {/* Exercise */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                          r.exercise === 'สม่ำเสมอ'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.exercise === 'บางครั้ง'
                            ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {r.exercise}
                        </span>
                      </td>

                      {/* Lifestyle & Exercise Impact Summary */}
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] border ${impact.color}`}>
                          {impact.badge}
                        </span>
                      </td>

                      {/* Risk Level & Score */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          r.riskLevel === 'สูง'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : r.riskLevel === 'ปานกลาง'
                            ? 'bg-amber-400 text-amber-950'
                            : 'bg-emerald-500 text-white shadow-xs'
                        }`}>
                          เสี่ยง{r.riskLevel} ({r.riskScore})
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(r);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="ดูเวชระเบียนรายบุคคล"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400 text-xs">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>
            แสดง {paginated.length} จาก {sorted.length} รายการ (จากทั้งหมด {records.length} รายการ)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ก่อนหน้า
            </button>
            <span className="px-3 py-1 font-semibold text-slate-800">
              หน้า {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal (Detail View) */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      เวชระเบียนคัดกรอง: {selectedRecord.id}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedRecord.riskLevel === 'สูง'
                        ? 'bg-rose-100 text-rose-700'
                        : selectedRecord.riskLevel === 'ปานกลาง'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      เสี่ยง{selectedRecord.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    วันที่ตรวจ: {selectedRecord.screenDate} • พื้นที่: {selectedRecord.area}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Vital Signs Grid */}
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">อายุ / เพศ</span>
                <span className="font-bold text-slate-800 text-sm">{selectedRecord.age} ปี ({selectedRecord.gender})</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">ส่วนสูง / น้ำหนัก</span>
                <span className="font-bold text-slate-800 text-sm">{selectedRecord.heightCm} cm / {selectedRecord.weightKg} kg</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">BMI</span>
                <span className="font-bold text-cyan-700 text-sm">{selectedRecord.bmi} kg/m²</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">ความดัน SBP/DBP</span>
                <span className="font-bold text-blue-700 text-sm">{selectedRecord.sbp} / {selectedRecord.dbp} mmHg</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">ชีพจร</span>
                <span className="font-bold text-slate-800 text-sm">{selectedRecord.pulse} bpm</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">น้ำตาล FBS</span>
                <span className="font-bold text-emerald-700 text-sm">{selectedRecord.bloodSugar} mg/dL</span>
              </div>
            </div>

            {/* Lifestyle & Behavior Detailed Assessment */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                การประเมินพฤติกรรมสุขภาพและผลกระทบของการออกกำลังกาย
              </h4>
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">การออกกำลังกาย</span>
                  <strong className="text-slate-800">{selectedRecord.exercise}</strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">สูบบุหรี่</span>
                  <strong className={selectedRecord.smoking === 'สูบ' ? 'text-rose-600' : 'text-slate-800'}>
                    {selectedRecord.smoking}
                  </strong>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block">ดื่มแอลกอฮอล์</span>
                  <strong className={selectedRecord.alcohol === 'ดื่ม' ? 'text-amber-600' : 'text-slate-800'}>
                    {selectedRecord.alcohol}
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-200/60 leading-relaxed">
                <strong>สรุปผลกระทบ:</strong> {getExerciseImpactNote(selectedRecord).detail}
              </p>
            </div>

            {/* Recommendations */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">คำแนะนำทางการพยาบาลและเวชระเบียน:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {selectedRecord.riskLevel === 'สูง'
                  ? 'ส่งต่อเข้าคลินิก NCDs เพื่อรับการประเมินโดยแพทย์อย่างเร่งด่วน พร้อมติดตามพฤติกรรมลดหวานมันเค็มและเริ่มต้นการออกกำลังกายเบา ๆ'
                  : selectedRecord.riskLevel === 'ปานกลาง'
                  ? 'เฝ้าระวังพฤติกรรม นัดตรวจซ้ำในอีก 3-6 เดือน เน้นการเพิ่มการออกกำลังกายเป็นสม่ำเสมอสัปดาห์ละ 150 นาที'
                  : 'สุขภาพอยู่ในเกณฑ์ดี แนะนำให้คงพฤติกรรมการออกกำลังกายสม่ำเสมอและตรวจสุขภาพประจำปี'}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-medium text-xs hover:bg-slate-800 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
