import React, { useState } from 'react';
import { HealthRecord } from '../types';
import { getExerciseImpactStats } from '../utils/analytics';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  HeartHandshake, 
  Dumbbell, 
  Cigarette, 
  Wine, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  TrendingDown,
  Layers,
  BarChart2
} from 'lucide-react';

interface HealthBehaviorSectionProps {
  records: HealthRecord[];
}

export const HealthBehaviorSection: React.FC<HealthBehaviorSectionProps> = ({ records }) => {
  const [metricView, setMetricView] = useState<'vitals' | 'riskBmi'>('vitals');

  const total = records.length;
  const exerciseStats = getExerciseImpactStats(records);

  // Field 1: Exercise
  const exRegular = records.filter(r => r.exercise === 'สม่ำเสมอ').length;
  const exSome = records.filter(r => r.exercise === 'บางครั้ง').length;
  const exNone = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย').length;

  // Field 2: Smoking
  const smokingYes = records.filter(r => r.smoking === 'สูบ').length;
  const smokingNo = records.filter(r => r.smoking === 'ไม่สูบ').length;

  // Field 3: Alcohol
  const alcoholYes = records.filter(r => r.alcohol === 'ดื่ม').length;
  const alcoholNo = records.filter(r => r.alcohol === 'ไม่ดื่ม').length;

  // Field 4: Combined Triple Risk (Smoke + Drink + No Exercise)
  const tripleRisk = records.filter(r => r.smoking === 'สูบ' && r.alcohol === 'ดื่ม' && r.exercise === 'ไม่ออกกำลังกาย').length;
  const zeroRiskLifestyle = records.filter(r => r.smoking === 'ไม่สูบ' && r.alcohol === 'ไม่ดื่ม' && r.exercise === 'สม่ำเสมอ').length;
  const partialRisk = total - tripleRisk - zeroRiskLifestyle;

  const pct = (val: number) => total > 0 ? ((val / total) * 100).toFixed(1) : '0';

  // Behavior vs Risk Matrix Calculation
  // 1. Regular Exercise
  const regLow = records.filter(r => r.exercise === 'สม่ำเสมอ' && r.riskLevel === 'ต่ำ').length;
  const regMed = records.filter(r => r.exercise === 'สม่ำเสมอ' && r.riskLevel === 'ปานกลาง').length;
  const regHigh = records.filter(r => r.exercise === 'สม่ำเสมอ' && r.riskLevel === 'สูง').length;

  // 2. Some Exercise
  const someLow = records.filter(r => r.exercise === 'บางครั้ง' && r.riskLevel === 'ต่ำ').length;
  const someMed = records.filter(r => r.exercise === 'บางครั้ง' && r.riskLevel === 'ปานกลาง').length;
  const someHigh = records.filter(r => r.exercise === 'บางครั้ง' && r.riskLevel === 'สูง').length;

  // 3. No Exercise
  const noLow = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskLevel === 'ต่ำ').length;
  const noMed = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskLevel === 'ปานกลาง').length;
  const noHigh = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย' && r.riskLevel === 'สูง').length;

  // Datasets for 4 small Donut Charts
  const exerciseChartData = [
    { name: 'สม่ำเสมอ', value: exRegular, color: '#10b981' },
    { name: 'บางครั้ง', value: exSome, color: '#f59e0b' },
    { name: 'ไม่ออกกำลังกาย', value: exNone, color: '#f43f5e' }
  ];

  const smokingChartData = [
    { name: 'ไม่สูบ', value: smokingNo, color: '#10b981' },
    { name: 'สูบ', value: smokingYes, color: '#f43f5e' }
  ];

  const alcoholChartData = [
    { name: 'ไม่ดื่ม', value: alcoholNo, color: '#10b981' },
    { name: 'ดื่ม', value: alcoholYes, color: '#f59e0b' }
  ];

  const combinedRiskChartData = [
    { name: 'วิถีชีวิตปลอดภัย (ไม่สูบ+ไม่ดื่ม+ออกกำลัง)', value: zeroRiskLifestyle, color: '#10b981' },
    { name: 'เสี่ยงบางส่วน (1-2 ปัจจัย)', value: partialRisk, color: '#8b5cf6' },
    { name: 'เสี่ยง 3 ปัจจัยซ้ำซ้อน (สูบ+ดื่ม+ไม่ออกกำลัง)', value: tripleRisk, color: '#f43f5e' }
  ];

  // Grouped Bar Data for Impact of Exercise
  const exerciseImpactBarData = exerciseStats.map((ex) => ({
    name: ex.label,
    sugar: Number(ex.avgSugar),
    sbp: Number(ex.avgSbp),
    bmi: Number(ex.avgBmi),
    highRiskPct: Number(ex.highRiskPct),
    count: ex.count
  }));

  // 100% Stacked Bar Data for Behavior vs Risk
  const stackedRiskData = [
    {
      name: 'สม่ำเสมอ',
      count: exRegular,
      lowPct: exRegular > 0 ? Math.round((regLow / exRegular) * 100) : 0,
      medPct: exRegular > 0 ? Math.round((regMed / exRegular) * 100) : 0,
      highPct: exRegular > 0 ? Math.round((regHigh / exRegular) * 100) : 0,
      lowCount: regLow,
      medCount: regMed,
      highCount: regHigh
    },
    {
      name: 'บางครั้ง',
      count: exSome,
      lowPct: exSome > 0 ? Math.round((someLow / exSome) * 100) : 0,
      medPct: exSome > 0 ? Math.round((someMed / exSome) * 100) : 0,
      highPct: exSome > 0 ? Math.round((someHigh / exSome) * 100) : 0,
      lowCount: someLow,
      medCount: someMed,
      highCount: someHigh
    },
    {
      name: 'ไม่ออกกำลังกาย',
      count: exNone,
      lowPct: exNone > 0 ? Math.round((noLow / exNone) * 100) : 0,
      medPct: exNone > 0 ? Math.round((noMed / exNone) * 100) : 0,
      highPct: exNone > 0 ? Math.round((noHigh / exNone) * 100) : 0,
      lowCount: noLow,
      medCount: noMed,
      highCount: noHigh
    }
  ];

  // Tooltip for Mini Donut
  const MiniDonutTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const p = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-slate-900/95 text-white p-2.5 rounded-xl text-xs backdrop-blur-xs border border-slate-700 shadow-xl">
          <p className="font-bold">{data.name}</p>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.payload.color }} />
            <span>{data.value} ราย ({p}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Tooltip for Stacked Risk Bar
  const StackedBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = stackedRiskData.find(d => d.name === label);
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl text-xs backdrop-blur-xs border border-slate-700 shadow-xl space-y-1.5">
          <p className="font-bold text-sm border-b border-slate-700 pb-1">กลุ่ม: ออกกำลังกาย{label}</p>
          <p className="text-slate-300">จำนวนทั้งหมด: {item?.count} ราย</p>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-emerald-400 gap-4">
              <span>ความเสี่ยงต่ำ:</span>
              <strong>{item?.lowCount} ราย ({item?.lowPct}%)</strong>
            </div>
            <div className="flex justify-between items-center text-amber-400 gap-4">
              <span>ความเสี่ยงปานกลาง:</span>
              <strong>{item?.medCount} ราย ({item?.medPct}%)</strong>
            </div>
            <div className="flex justify-between items-center text-rose-400 gap-4">
              <span>ความเสี่ยงสูง:</span>
              <strong>{item?.highCount} ราย ({item?.highPct}%)</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              การวิเคราะห์พฤติกรรมและวิถีชีวิตสุขภาพ (Health Behaviors)
            </h2>
            <p className="text-xs text-slate-500">
              แผนภาพวิเคราะห์ 4 ปัจจัยพฤติกรรมหลัก: การออกกำลังกาย, การสูบบุหรี่, การดื่มแอลกอฮอล์ และผลกระทบต่อระดับความเสี่ยง
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          ออกกำลังกายสม่ำเสมอ {pct(exRegular)}%
        </span>
      </div>

      {/* 4 Key Behavior Fields as Visual Donut Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Field 1: การออกกำลังกาย Donut */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">1. การออกกำลังกาย</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              สม่ำเสมอ {pct(exRegular)}%
            </span>
          </div>

          <div className="h-36 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<MiniDonutTooltip />} />
                <Pie
                  data={exerciseChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={55}
                  paddingAngle={3}
                >
                  {exerciseChartData.map((e, idx) => (
                    <Cell key={`ex-pie-${idx}`} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-slate-800">{exRegular}</span>
              <span className="text-[9px] text-slate-400">สม่ำเสมอ</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-2 border-t border-slate-100">
            <div className="text-emerald-700">
              <span className="block font-bold">{exRegular}</span>
              <span className="text-slate-500">สม่ำเสมอ</span>
            </div>
            <div className="text-amber-700">
              <span className="block font-bold">{exSome}</span>
              <span className="text-slate-500">บางครั้ง</span>
            </div>
            <div className="text-rose-600">
              <span className="block font-bold">{exNone}</span>
              <span className="text-slate-500">ไม่ออกฯ</span>
            </div>
          </div>
        </div>

        {/* Field 2: สูบบุหรี่ Donut */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
                <Cigarette className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">2. การสูบบุหรี่</span>
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
              สูบ {pct(smokingYes)}%
            </span>
          </div>

          <div className="h-36 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<MiniDonutTooltip />} />
                <Pie
                  data={smokingChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={55}
                  paddingAngle={3}
                >
                  {smokingChartData.map((e, idx) => (
                    <Cell key={`smoke-pie-${idx}`} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-slate-800">{smokingYes}</span>
              <span className="text-[9px] text-slate-400">สูบบุหรี่</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] text-center pt-2 border-t border-slate-100">
            <div className="text-rose-600">
              <span className="block font-bold">{smokingYes} คน ({pct(smokingYes)}%)</span>
              <span className="text-slate-500">สูบ</span>
            </div>
            <div className="text-emerald-700">
              <span className="block font-bold">{smokingNo} คน ({pct(smokingNo)}%)</span>
              <span className="text-slate-500">ไม่สูบ</span>
            </div>
          </div>
        </div>

        {/* Field 3: ดื่มแอลกอฮอล์ Donut */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                <Wine className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">3. ดื่มแอลกอฮอล์</span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              ดื่ม {pct(alcoholYes)}%
            </span>
          </div>

          <div className="h-36 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<MiniDonutTooltip />} />
                <Pie
                  data={alcoholChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={55}
                  paddingAngle={3}
                >
                  {alcoholChartData.map((e, idx) => (
                    <Cell key={`alc-pie-${idx}`} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-slate-800">{alcoholYes}</span>
              <span className="text-[9px] text-slate-400">ดื่มสุรา</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] text-center pt-2 border-t border-slate-100">
            <div className="text-amber-700">
              <span className="block font-bold">{alcoholYes} คน ({pct(alcoholYes)}%)</span>
              <span className="text-slate-500">ดื่ม</span>
            </div>
            <div className="text-emerald-700">
              <span className="block font-bold">{alcoholNo} คน ({pct(alcoholNo)}%)</span>
              <span className="text-slate-500">ไม่ดื่ม</span>
            </div>
          </div>
        </div>

        {/* Field 4: พฤติกรรมร่วมหลายปัจจัย Donut */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-100">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800">4. พฤติกรรมร่วม</span>
            </div>
            <span className="text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
              เสี่ยง 3 ด้าน: {tripleRisk} ราย
            </span>
          </div>

          <div className="h-36 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<MiniDonutTooltip />} />
                <Pie
                  data={combinedRiskChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={55}
                  paddingAngle={3}
                >
                  {combinedRiskChartData.map((e, idx) => (
                    <Cell key={`comb-pie-${idx}`} fill={e.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sm font-black text-rose-600">{tripleRisk}</span>
              <span className="text-[9px] text-slate-400">เสี่ยง 3 ด้าน</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-[10px] text-center pt-2 border-t border-slate-100">
            <div className="text-emerald-700">
              <span className="block font-bold">{zeroRiskLifestyle} คน</span>
              <span className="text-slate-500">วิถีชีวิตปลอดภัย</span>
            </div>
            <div className="text-rose-600">
              <span className="block font-bold">{tripleRisk} คน</span>
              <span className="text-slate-500">เสี่ยง 3 ด้าน</span>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Chart 1: Grouped Bar Chart of Exercise Impact on Key Health Metrics */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              แผนภูมิเปรียบเทียบผลกระทบของการออกกำลังกายต่อตัวชี้วัดสุขภาพ (Exercise Impact Chart)
            </h3>
            <p className="text-xs text-slate-500">
              กราฟแท่งเปรียบเทียบค่าเฉลี่ยทางชีวภาพและระดับความเสี่ยงระหว่างกลุ่มที่ออกกำลังกายต่างกัน
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setMetricView('vitals')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricView === 'vitals'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              น้ำตาล (FBS) & ความดัน (SBP)
            </button>
            <button
              onClick={() => setMetricView('riskBmi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricView === 'riskBmi'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BMI & สัดส่วนเสี่ยงสูง (%)
            </button>
          </div>
        </div>

        {/* Grouped Bar Chart Container */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={exerciseImpactBarData}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip 
                formatter={(value: any, name: any) => {
                  if (name === 'น้ำตาลเฉลี่ย (mg/dL)') return [`${value} mg/dL`, name];
                  if (name === 'ความดันตัวบนเฉลี่ย (mmHg)') return [`${value} mmHg`, name];
                  if (name === 'BMI เฉลี่ย (kg/m²)') return [`${value} kg/m²`, name];
                  if (name === 'สัดส่วนกลุ่มเสี่ยงสูง (%)') return [`${value}%`, name];
                  return [value, name];
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />

              {metricView === 'vitals' ? (
                <>
                  <Bar 
                    dataKey="sugar" 
                    name="น้ำตาลเฉลี่ย (mg/dL)" 
                    fill="#10b981" 
                    radius={[6, 6, 0, 0]} 
                  />
                  <Bar 
                    dataKey="sbp" 
                    name="ความดันตัวบนเฉลี่ย (mmHg)" 
                    fill="#0284c7" 
                    radius={[6, 6, 0, 0]} 
                  />
                </>
              ) : (
                <>
                  <Bar 
                    dataKey="bmi" 
                    name="BMI เฉลี่ย (kg/m²)" 
                    fill="#8b5cf6" 
                    radius={[6, 6, 0, 0]} 
                  />
                  <Bar 
                    dataKey="highRiskPct" 
                    name="สัดส่วนกลุ่มเสี่ยงสูง (%)" 
                    fill="#f43f5e" 
                    radius={[6, 6, 0, 0]} 
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Clinical Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {exerciseStats.map((ex) => {
            const isGood = ex.level === 'สม่ำเสมอ';
            const isBad = ex.level === 'ไม่ออกกำลังกาย';

            return (
              <div 
                key={ex.level}
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  isGood ? 'bg-emerald-50/50 border-emerald-200' : isBad ? 'bg-rose-50/50 border-rose-200' : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <div className="flex justify-between items-center">
                  <strong className="text-slate-800">{ex.label} ({ex.count} ราย)</strong>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                    isGood ? 'bg-emerald-100 text-emerald-800' : isBad ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    เสี่ยงสูง {ex.highRiskPct}%
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  FBS: <strong>{ex.avgSugar}</strong> mg/dL | SBP: <strong>{ex.avgSbp}</strong> mmHg | BMI: <strong>{ex.avgBmi}</strong>
                </p>
                <div className="flex items-center gap-1 text-[11px] font-medium pt-0.5">
                  {isGood ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5" /> น้ำตาลลดลงเฉลี่ย 48 mg/dL และความดันลดลง 28 mmHg
                    </span>
                  ) : isBad ? (
                    <span className="text-rose-700 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> ความดันโลหิตและน้ำตาลเฉลี่ยสูงที่สุดในกลุ่ม
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> มีแนวโน้มช่วยลดความเสี่ยงลงมาอยู่ในระดับปานกลาง
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Chart 2: 100% Stacked Bar Chart & Matrix Heatmap for Behavior vs Risk Level */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-violet-600" />
              แผนภูมิแท่งซ้อน 100% จำแนกระดับความเสี่ยงตามการออกกำลังกาย (100% Stacked Risk Chart)
            </h3>
            <p className="text-xs text-slate-500">
              แสดงสัดส่วนผู้ที่มีความเสี่ยงต่ำ ปานกลาง และสูง (0 - 100%) ในแต่ละกลุ่มพฤติกรรม
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> เสี่ยงต่ำ (0-1)
            </span>
            <span className="flex items-center gap-1 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> เสี่ยงปานกลาง (2-3)
            </span>
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> เสี่ยงสูง (4-7)
            </span>
          </div>
        </div>

        {/* 100% Stacked Bar Chart Container */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackedRiskData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                unit="%"
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }}
              />
              <Tooltip content={<StackedBarTooltip />} />
              <Bar 
                dataKey="lowPct" 
                name="เสี่ยงต่ำ (%)" 
                stackId="a" 
                fill="#10b981" 
                radius={[4, 0, 0, 4]} 
              />
              <Bar 
                dataKey="medPct" 
                name="เสี่ยงปานกลาง (%)" 
                stackId="a" 
                fill="#f59e0b" 
              />
              <Bar 
                dataKey="highPct" 
                name="เสี่ยงสูง (%)" 
                stackId="a" 
                fill="#f43f5e" 
                radius={[0, 4, 4, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Matrix Heatmap Table View */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-y border-slate-200">
                <th className="py-2.5 px-4">พฤติกรรมการออกกำลังกาย</th>
                <th className="py-2.5 px-4 text-center">ผู้คัดกรอง</th>
                <th className="py-2.5 px-4 text-center">ความเสี่ยงต่ำ (0-1)</th>
                <th className="py-2.5 px-4 text-center">ความเสี่ยงปานกลาง (2-3)</th>
                <th className="py-2.5 px-4 text-center">ความเสี่ยงสูง (4-7)</th>
                <th className="py-2.5 px-4 text-center">ผลการวิเคราะห์</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-emerald-50/40 transition-colors">
                <td className="py-3 px-4 font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  สม่ำเสมอ
                </td>
                <td className="py-3 px-4 text-center font-bold text-slate-800">{exRegular} ราย</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500 text-white font-bold shadow-2xs">
                    {regLow} ราย (100%)
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-slate-400">0%</td>
                <td className="py-3 px-4 text-center text-slate-400">0%</td>
                <td className="py-3 px-4 text-center text-emerald-700 font-semibold">
                  ปลอดภัย ปราศจากความเสี่ยงรุนแรง
                </td>
              </tr>

              <tr className="hover:bg-amber-50/40 transition-colors">
                <td className="py-3 px-4 font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  บางครั้ง
                </td>
                <td className="py-3 px-4 text-center font-bold text-slate-800">{exSome} ราย</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
                    {someLow} ราย ({exSome > 0 ? Math.round((someLow/exSome)*100) : 0}%)
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-3 py-1 rounded-lg bg-amber-400 text-slate-900 font-bold shadow-2xs">
                    {someMed} ราย ({exSome > 0 ? Math.round((someMed/exSome)*100) : 0}%)
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-700 font-semibold">
                    {someHigh} ราย ({exSome > 0 ? Math.round((someHigh/exSome)*100) : 0}%)
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-amber-800 font-medium">
                  ชะลอความเสี่ยงได้ ควรเพิ่มความสม่ำเสมอ
                </td>
              </tr>

              <tr className="hover:bg-rose-50/40 transition-colors">
                <td className="py-3 px-4 font-bold text-rose-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  ไม่ออกกำลังกาย
                </td>
                <td className="py-3 px-4 text-center font-bold text-slate-800">{exNone} ราย</td>
                <td className="py-3 px-4 text-center text-slate-400">0%</td>
                <td className="py-3 px-4 text-center text-slate-400">0%</td>
                <td className="py-3 px-4 text-center">
                  <span className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold shadow-2xs">
                    {noHigh} ราย (100%)
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-rose-700 font-bold">
                  อัตราเสี่ยงสูง 100% กลุ่มเป้าหมายเร่งด่วน
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
