import React, { useState } from 'react';
import { HealthRecord } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  ShieldAlert, 
  Activity, 
  Droplet, 
  Weight, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

interface HealthRiskSectionProps {
  records: HealthRecord[];
}

export const HealthRiskSection: React.FC<HealthRiskSectionProps> = ({ records }) => {
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar');
  const [hoveredVenn, setHoveredVenn] = useState<string | null>(null);

  const total = records.length;

  // 1. SBP Field: ปกติ (<120), เสี่ยง (120-139), สูง (≥140)
  const sbpNormal = records.filter(r => r.sbp < 120).length;
  const sbpPreRisk = records.filter(r => r.sbp >= 120 && r.sbp < 140).length;
  const sbpHigh = records.filter(r => r.sbp >= 140).length;

  // 2. น้ำตาล Field: ปกติ (<100), เสี่ยง (100-125), สูง (≥126)
  const sugarNormal = records.filter(r => r.bloodSugar < 100).length;
  const sugarPreRisk = records.filter(r => r.bloodSugar >= 100 && r.bloodSugar <= 125).length;
  const sugarHigh = records.filter(r => r.bloodSugar >= 126).length;

  // 3. BMI Field: ปกติ (<23), น้ำหนักเกิน (23-24.9), อ้วน (≥25)
  const bmiNormal = records.filter(r => r.bmi < 23).length;
  const bmiOverweight = records.filter(r => r.bmi >= 23 && r.bmi < 25).length;
  const bmiObese = records.filter(r => r.bmi >= 25).length;

  // 4. ระดับความเสี่ยง & คะแนนความเสี่ยง: ต่ำ, ปานกลาง, สูง
  const riskLow = records.filter(r => r.riskLevel === 'ต่ำ').length;
  const riskMed = records.filter(r => r.riskLevel === 'ปานกลาง').length;
  const riskHigh = records.filter(r => r.riskLevel === 'สูง').length;

  // 5. คัดกรองโรคร่วม (Comorbidity)
  const diabetesRiskTotal = records.filter(r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const hypertensionRiskTotal = records.filter(r => r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const bothHigh = records.filter(r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง' && r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const diabetesOnly = records.filter(r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง' && r.hypertensionRisk !== 'มีแนวโน้ม/เสี่ยง').length;
  const hypertensionOnly = records.filter(r => r.diabetesRisk !== 'มีแนวโน้ม/เสี่ยง' && r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const neitherHigh = records.filter(r => r.diabetesRisk !== 'มีแนวโน้ม/เสี่ยง' && r.hypertensionRisk !== 'มีแนวโน้ม/เสี่ยง').length;

  const pct = (val: number) => total > 0 ? ((val / total) * 100).toFixed(1) : '0';

  // Chart datasets
  const sbpData = [
    { name: 'ปกติ (<120)', count: sbpNormal, pct: Number(pct(sbpNormal)), color: '#10b981', labelTh: 'ปกติ' },
    { name: 'เริ่มเสี่ยง (120-139)', count: sbpPreRisk, pct: Number(pct(sbpPreRisk)), color: '#f59e0b', labelTh: 'ระยะเริ่มเสี่ยง' },
    { name: 'ความดันสูง (≥140)', count: sbpHigh, pct: Number(pct(sbpHigh)), color: '#f43f5e', labelTh: 'ความดันสูง' },
  ];

  const sugarData = [
    { name: 'ปกติ (<100)', count: sugarNormal, pct: Number(pct(sugarNormal)), color: '#10b981', labelTh: 'ปกติ' },
    { name: 'ก่อนเบาหวาน (100-125)', count: sugarPreRisk, pct: Number(pct(sugarPreRisk)), color: '#f59e0b', labelTh: 'ก่อนเบาหวาน' },
    { name: 'เสี่ยงเบาหวาน (≥126)', count: sugarHigh, pct: Number(pct(sugarHigh)), color: '#f43f5e', labelTh: 'เสี่ยงเบาหวาน' },
  ];

  const bmiData = [
    { name: 'สมส่วน (<23)', count: bmiNormal, pct: Number(pct(bmiNormal)), color: '#10b981', labelTh: 'สมส่วน' },
    { name: 'น้ำหนักเกิน (23-24.9)', count: bmiOverweight, pct: Number(pct(bmiOverweight)), color: '#f59e0b', labelTh: 'น้ำหนักเกิน' },
    { name: 'ภาวะอ้วน (≥25)', count: bmiObese, pct: Number(pct(bmiObese)), color: '#f43f5e', labelTh: 'ภาวะอ้วน' },
  ];

  const riskData = [
    { name: 'ความเสี่ยงต่ำ', count: riskLow, pct: Number(pct(riskLow)), score: '0-1 คะแนน', color: '#10b981' },
    { name: 'ความเสี่ยงปานกลาง', count: riskMed, pct: Number(pct(riskMed)), score: '2-3 คะแนน', color: '#f59e0b' },
    { name: 'ความเสี่ยงสูง', count: riskHigh, pct: Number(pct(riskHigh)), score: '4-7 คะแนน', color: '#f43f5e' },
  ];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 backdrop-blur-xs border border-slate-700">
          <p className="font-bold text-sm text-slate-100">{data.name}</p>
          <div className="flex items-center gap-2 pt-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>จำนวน: <strong>{data.count}</strong> ราย ({data.pct}%)</span>
          </div>
          {data.score && <p className="text-slate-300 text-[11px]">ช่วงคะแนน: {data.score}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              การวิเคราะห์ความเสี่ยงสุขภาพ (Health Risk Analysis)
            </h2>
            <p className="text-xs text-slate-500">
              แผนภาพจำแนก 4 ปัจจัยเสี่ยงสุขภาพหลัก: ความดันโลหิตตัวบน, น้ำตาลในเลือด, ดัชนีมวลกาย และระดับความเสี่ยงภาพรวม
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Chart Display Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                chartType === 'bar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>แผนภูมิแท่ง</span>
            </button>
            <button
              onClick={() => setChartType('donut')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                chartType === 'donut'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5 text-violet-600" />
              <span>แผนภูมิวงกลม</span>
            </button>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            เสี่ยงสูง {pct(riskHigh)}%
          </span>
        </div>
      </div>

      {/* Grid of 4 Key Risk Fields Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Field 1: SBP_mmHg Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  1. ระดับความดันโลหิตตัวบน (SBP mmHg)
                </h3>
                <span className="text-[11px] text-slate-500">เกณฑ์คัดกรองความดันโลหิตสูง (ปกติ / เสี่ยง / สูง)</span>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
              ความดันสูง {pct(sbpHigh)}%
            </span>
          </div>

          {/* Chart Container */}
          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={sbpData} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="labelTh" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    interval={0}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {sbpData.map((entry, index) => (
                      <Cell key={`sbp-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={sbpData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {sbpData.map((entry, index) => (
                      <Cell key={`sbp-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
            {sbpData.map((d, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] text-slate-500 truncate">{d.name}</span>
                <span className="font-extrabold text-sm" style={{ color: d.color }}>{d.count} ราย</span>
                <span className="block text-[10px] text-slate-400">({d.pct}%)</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900">
            <strong>ข้อสังเกตทางการแพทย์:</strong> ผู้ที่มีค่า SBP สูงเกิน 140 mmHg มีโอกาสสัมพันธ์กับคะแนนความเสี่ยงโรคหัวใจและหลอดเลือดอย่างมีนัยสำคัญ
          </div>
        </div>

        {/* Field 2: ระดับน้ำตาลในเลือด (Blood Glucose) Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  2. ระดับน้ำตาลในเลือด (Blood Glucose mg/dL)
                </h3>
                <span className="text-[11px] text-slate-500">เกณฑ์คัดกรองเบาหวาน (ปกติ / ก่อนเบาหวาน / เสี่ยง)</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ปกติ {pct(sugarNormal)}%
            </span>
          </div>

          {/* Chart Container */}
          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={sugarData} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="labelTh" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    interval={0}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {sugarData.map((entry, index) => (
                      <Cell key={`sugar-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={sugarData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {sugarData.map((entry, index) => (
                      <Cell key={`sugar-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
            {sugarData.map((d, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] text-slate-500 truncate">{d.name}</span>
                <span className="font-extrabold text-sm" style={{ color: d.color }}>{d.count} ราย</span>
                <span className="block text-[10px] text-slate-400">({d.pct}%)</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-900">
            <strong>เป้าหมายทางคลินิก:</strong> กลุ่มก่อนเบาหวาน ({sugarPreRisk} ราย) สามารถปรับเปลี่ยนพฤติกรรมลดน้ำตาลในเลือดให้กลับสู่เกณฑ์ปกติได้
          </div>
        </div>

        {/* Field 3: BMI ดัชนีมวลกาย Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                <Weight className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  3. ดัชนีมวลกาย (BMI - Asian Criteria)
                </h3>
                <span className="text-[11px] text-slate-500">เกณฑ์สมส่วน (&lt;23), น้ำหนักเกิน (23-24.9), อ้วน (≥25)</span>
              </div>
            </div>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-200">
              อ้วน {pct(bmiObese)}%
            </span>
          </div>

          {/* Chart Container */}
          <div className="h-56 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={bmiData} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="labelTh" 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    interval={0}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {bmiData.map((entry, index) => (
                      <Cell key={`bmi-cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={bmiData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {bmiData.map((entry, index) => (
                      <Cell key={`bmi-pie-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
            {bmiData.map((d, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] text-slate-500 truncate">{d.name}</span>
                <span className="font-extrabold text-sm" style={{ color: d.color }}>{d.count} ราย</span>
                <span className="block text-[10px] text-slate-400">({d.pct}%)</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-50/60 border border-cyan-100 text-[11px] text-cyan-900">
            <strong>ข้อมูลเชิงสถิติ:</strong> ผู้มีภาวะอ้วน (BMI ≥ 25) ในกลุ่มนี้สัมพันธ์กับอัตราการเกิดความดันโลหิตสูงและเบาหวานอย่างชัดเจน
          </div>
        </div>

        {/* Field 4: ระดับความเสี่ยงและคะแนนความเสี่ยง (Risk Level & Score) Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  4. ระดับความเสี่ยงภาพรวม (Risk Level Distribution)
                </h3>
                <span className="text-[11px] text-slate-500">จำแนกตามเกณฑ์คะแนนความเสี่ยง 0 - 7 (ต่ำ / กลาง / สูง)</span>
              </div>
            </div>
            <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-lg border border-violet-200">
              3 ระดับคะแนน
            </span>
          </div>

          {/* Donut Chart with Center Indicator */}
          <div className="h-56 w-full pt-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={riskData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`risk-pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label for Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-800">{total}</span>
              <span className="text-[10px] text-slate-400 font-medium">ผู้คัดกรอง</span>
            </div>
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-center">
            {riskData.map((d, i) => (
              <div key={i} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] text-slate-500 truncate">{d.name}</span>
                <span className="font-extrabold text-sm" style={{ color: d.color }}>{d.count} ราย</span>
                <span className="block text-[10px] text-slate-400">({d.pct}%)</span>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-violet-50/60 border border-violet-100 text-[11px] text-violet-900">
            <strong>ข้อสรุปความเสี่ยง:</strong> ประชากรกลุ่มเสี่ยงสูง ({riskHigh} ราย) จำเป็นต้องได้รับการส่งต่อเพื่อรับคำปรึกษาปรับเปลี่ยนพฤติกรรมอย่างใกล้ชิด
          </div>
        </div>

      </div>

      {/* 5. Comorbidity Venn Diagram (แผนภาพเวนน์ภาวะโรคร่วม เบาหวานและความดันโลหิตสูง) */}
      <div className="rounded-2xl p-5 bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-rose-600 text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                5. แผนภาพเวนน์ภาวะโรคร่วม (Comorbidity Venn Diagram: Diabetes vs Hypertension)
              </h3>
              <p className="text-xs text-slate-500">
                วิเคราะห์การซ้อนทับกันของกลุ่มเสี่ยงเบาหวานและกลุ่มเสี่ยงความดันโลหิตสูง (Hover ที่วงกลมเพื่อดูรายละเอียด)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              เสี่ยงทั้ง 2 โรค: {bothHigh} ราย ({pct(bothHigh)}%)
            </span>
          </div>
        </div>

        {/* SVG Venn Diagram Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Interactive SVG Diagram (2 cols) */}
          <div className="lg:col-span-2 relative bg-slate-50/60 rounded-2xl p-4 border border-slate-100 flex justify-center">
            <svg 
              viewBox="0 0 540 280" 
              className="w-full max-w-lg h-auto select-none"
            >
              <defs>
                {/* Gradients */}
                <linearGradient id="diabetesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.65" />
                </linearGradient>
                <linearGradient id="htGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.65" />
                </linearGradient>
                <linearGradient id="overlapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Background frame */}
              <rect x="10" y="10" width="520" height="260" rx="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
              <text x="25" y="32" className="text-[11px] fill-slate-400 font-semibold">
                ประชากรคัดกรองทั้งหมด: {total} ราย (100%)
              </text>

              {/* Left Circle: Diabetes Risk */}
              <circle
                cx="210"
                cy="145"
                r="95"
                fill="url(#diabetesGrad)"
                stroke="#0891b2"
                strokeWidth={hoveredVenn === 'diabetes' ? 3 : 1.5}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredVenn('diabetes')}
                onMouseLeave={() => setHoveredVenn(null)}
              />

              {/* Right Circle: Hypertension Risk */}
              <circle
                cx="330"
                cy="145"
                r="95"
                fill="url(#htGrad)"
                stroke="#e11d48"
                strokeWidth={hoveredVenn === 'ht' ? 3 : 1.5}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredVenn('ht')}
                onMouseLeave={() => setHoveredVenn(null)}
              />

              {/* Central Overlap Region highlight */}
              <ellipse
                cx="270"
                cy="145"
                rx="42"
                ry="72"
                fill="url(#overlapGrad)"
                stroke="#6d28d9"
                strokeWidth={hoveredVenn === 'both' ? 3 : 1.5}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredVenn('both')}
                onMouseLeave={() => setHoveredVenn(null)}
              />

              {/* Text Labels inside Left Circle (Diabetes Only) */}
              <text x="160" y="130" textAnchor="middle" className="text-xs font-bold fill-cyan-950">
                เบาหวานอย่างเดียว
              </text>
              <text x="160" y="155" textAnchor="middle" className="text-xl font-extrabold fill-cyan-900">
                {diabetesOnly} ราย
              </text>
              <text x="160" y="172" textAnchor="middle" className="text-[11px] font-semibold fill-cyan-800">
                ({pct(diabetesOnly)}%)
              </text>

              {/* Text Labels inside Right Circle (HT Only) */}
              <text x="380" y="130" textAnchor="middle" className="text-xs font-bold fill-rose-950">
                ความดันอย่างเดียว
              </text>
              <text x="380" y="155" textAnchor="middle" className="text-xl font-extrabold fill-rose-900">
                {hypertensionOnly} ราย
              </text>
              <text x="380" y="172" textAnchor="middle" className="text-[11px] font-semibold fill-rose-800">
                ({pct(hypertensionOnly)}%)
              </text>

              {/* Text Labels inside Overlap (Both) */}
              <text x="270" y="132" textAnchor="middle" className="text-xs font-black fill-white">
                เสี่ยงทั้ง 2 โรค
              </text>
              <text x="270" y="156" textAnchor="middle" className="text-2xl font-black fill-white drop-shadow-xs">
                {bothHigh}
              </text>
              <text x="270" y="174" textAnchor="middle" className="text-[11px] font-bold fill-white">
                ({pct(bothHigh)}%)
              </text>

              {/* Outside Label: Neither */}
              <g 
                className="cursor-pointer"
                onMouseEnter={() => setHoveredVenn('neither')}
                onMouseLeave={() => setHoveredVenn(null)}
              >
                <rect x="25" y="220" width="170" height="38" rx="8" fill="#f8fafc" stroke="#cbd5e1" />
                <text x="35" y="236" className="text-[11px] font-semibold fill-slate-700">
                  ไม่พบความเสี่ยงทั้ง 2 โรค:
                </text>
                <text x="35" y="250" className="text-[11px] font-bold fill-emerald-600">
                  {neitherHigh} ราย ({pct(neitherHigh)}%)
                </text>
              </g>
            </svg>
          </div>

          {/* Comorbidity Insights Panel (1 col) */}
          <div className="space-y-3">
            <div className={`p-3.5 rounded-xl border transition-all ${
              hoveredVenn === 'both' 
                ? 'bg-violet-50 border-violet-300 ring-2 ring-violet-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-900">กลุ่มโรคร่วม (Both Risks)</span>
                <span className="text-xs font-extrabold text-violet-700">{bothHigh} คน ({pct(bothHigh)}%)</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                มีแนวโน้มทั้งเบาหวานและความดันโลหิตสูง จำเป็นต้องได้รับการดูแลเพื่อป้องกันภาวะแทรกซ้อนที่ไตและหลอดเลือดหัวใจ
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all ${
              hoveredVenn === 'diabetes' 
                ? 'bg-cyan-50 border-cyan-300 ring-2 ring-cyan-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-900">เสี่ยงเบาหวานรวม</span>
                <span className="text-xs font-extrabold text-cyan-700">{diabetesRiskTotal} คน ({pct(diabetesRiskTotal)}%)</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                พบระดับน้ำตาลสะสมหรือ FBS เกิน 100 mg/dL โดย {diabetesOnly} ราย ยังไม่มีภาวะความดันสูง
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border transition-all ${
              hoveredVenn === 'ht' 
                ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-200' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900">เสี่ยงความดันโลหิตสูงรวม</span>
                <span className="text-xs font-extrabold text-rose-700">{hypertensionRiskTotal} คน ({pct(hypertensionRiskTotal)}%)</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                พบค่า SBP ≥ 140 mmHg โดย {hypertensionOnly} ราย ยังไม่มีแนวโน้มเบาหวาน
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
