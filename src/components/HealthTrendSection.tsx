import React, { useState } from 'react';
import { HealthRecord } from '../types';
import { 
  getMonthTrendStats, 
  getAgeGroupStats, 
  getAreaStats 
} from '../utils/analytics';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  MapPin, 
  AlertCircle, 
  ShieldAlert,
  Activity,
  LineChart as LineChartIcon,
  CheckCircle2
} from 'lucide-react';

interface HealthTrendSectionProps {
  records: HealthRecord[];
}

export const HealthTrendSection: React.FC<HealthTrendSectionProps> = ({ records }) => {
  const [selectedMetric, setSelectedMetric] = useState<'sugar' | 'sbp' | 'bmi' | 'all'>('sugar');

  const monthStats = getMonthTrendStats(records);
  const ageStats = getAgeGroupStats(records);
  const areaStats = getAreaStats(records);

  // Transform monthly data for Recharts
  const monthlyChartData = monthStats.map((m) => ({
    month: m.month,
    name: m.monthName,
    shortName: m.monthName.replace(' 2026', ''),
    sugar: m.avgSugar,
    sbp: m.avgSbp,
    bmi: m.avgBmi,
    count: m.count,
    highRiskCount: m.highRiskCount,
    highRiskPct: m.count > 0 ? Number(((m.highRiskCount / m.count) * 100).toFixed(1)) : 0
  }));

  // Metric visual configuration
  const metricConfig = {
    sugar: {
      label: 'ระดับน้ำตาลเฉลี่ย (FBS)',
      unit: 'mg/dL',
      color: '#10b981',
      gradId: 'sugarGrad',
      refLine: 100,
      refLabel: 'เกณฑ์ปกติ (<100 mg/dL)',
      domain: [70, 160] as [number, number]
    },
    sbp: {
      label: 'ความดันตัวบนเฉลี่ย (SBP)',
      unit: 'mmHg',
      color: '#3b82f6',
      gradId: 'sbpGrad',
      refLine: 120,
      refLabel: 'เกณฑ์ปกติ (<120 mmHg)',
      domain: [100, 160] as [number, number]
    },
    bmi: {
      label: 'ดัชนีมวลกายเฉลี่ย (BMI)',
      unit: 'kg/m²',
      color: '#06b6d4',
      gradId: 'bmiGrad',
      refLine: 23,
      refLabel: 'เกณฑ์สมส่วน (<23 kg/m²)',
      domain: [18, 32] as [number, number]
    }
  };

  // Custom Monthly Chart Tooltip
  const CustomMonthlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-2 backdrop-blur-xs border border-slate-700">
          <div className="flex items-center justify-between gap-4 border-b border-slate-700 pb-1.5">
            <span className="font-bold text-sm text-slate-100">{data.name}</span>
            <span className="text-slate-400">คัดกรอง {data.count} ราย</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-emerald-400 gap-4">
              <span>น้ำตาลเฉลี่ย (FBS):</span>
              <strong>{data.sugar} mg/dL</strong>
            </div>
            <div className="flex items-center justify-between text-blue-400 gap-4">
              <span>ความดันเฉลี่ย (SBP):</span>
              <strong>{data.sbp} mmHg</strong>
            </div>
            <div className="flex items-center justify-between text-cyan-400 gap-4">
              <span>BMI เฉลี่ย:</span>
              <strong>{data.bmi} kg/m²</strong>
            </div>
            <div className="flex items-center justify-between text-rose-400 gap-4 pt-1 border-t border-slate-800">
              <span>กลุ่มเสี่ยงสูง:</span>
              <strong>{data.highRiskCount} คน ({data.highRiskPct}%)</strong>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              การวิเคราะห์แนวโน้มและกลุ่มประชากร (Health Trends & Demographics)
            </h2>
            <p className="text-xs text-slate-500">
              ติดตามทิศทางตัวชี้วัดสุขภาพตามช่วงเวลา การกระจายตัวตามกลุ่มอายุ และพื้นที่ที่มีความเสี่ยงสูง
            </p>
          </div>
        </div>
      </div>

      {/* 1. Monthly Trend Analysis (FIELD 1) with BOTH GRAPH and NUMBERS */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <Calendar className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                1. แนวโน้มตัวชี้วัดสุขภาพรายเดือน (Monthly Health Trends)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงข้อมูลกราฟเปรียบเทียบแนวโน้มทางสุขภาพร่วมกับตัวเลขสรุปผลคัดกรองรายเดือน มกราคม - มีนาคม 2026
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setSelectedMetric('sugar')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'sugar'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              น้ำตาลเฉลี่ย
            </button>
            <button
              onClick={() => setSelectedMetric('sbp')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'sbp'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ความดัน SBP เฉลี่ย
            </button>
            <button
              onClick={() => setSelectedMetric('bmi')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'bmi'
                  ? 'bg-white text-cyan-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BMI เฉลี่ย
            </button>
            <button
              onClick={() => setSelectedMetric('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMetric === 'all'
                  ? 'bg-white text-violet-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              เปรียบเทียบทุกตัวชี้วัด
            </button>
          </div>
        </div>

        {/* SECTION 1A: Monthly Trend Graph (รูปแบบกราฟ) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <LineChartIcon className="w-4 h-4 text-violet-600" />
              แผนภูมิกราฟแนวโน้มรายเดือน (Monthly Trend Graph)
            </span>
            <span className="text-slate-400 text-[11px]">
              {selectedMetric === 'sugar' && 'เกณฑ์มาตรฐานปกติ: น้ำตาล < 100 mg/dL'}
              {selectedMetric === 'sbp' && 'เกณฑ์มาตรฐานปกติ: SBP < 120 mmHg'}
              {selectedMetric === 'bmi' && 'เกณฑ์มาตรฐานปกติ: BMI < 23 kg/m²'}
              {selectedMetric === 'all' && 'เปรียบเทียบเส้นแนวโน้ม FBS, SBP และ BMI'}
            </span>
          </div>

          <div className="h-64 w-full bg-slate-50/40 rounded-2xl p-3 border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              {selectedMetric === 'all' ? (
                /* Multi-line Trend Chart */
                <LineChart data={monthlyChartData} margin={{ top: 15, right: 25, left: -5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip content={<CustomMonthlyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="sugar" 
                    name="น้ำตาลเฉลี่ย (mg/dL)" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sbp" 
                    name="ความดันตัวบน (mmHg)" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bmi" 
                    name="BMI เฉลี่ย (kg/m²)" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              ) : (
                /* Single Metric Area Chart with Gradient & Reference Line */
                <AreaChart data={monthlyChartData} margin={{ top: 15, right: 25, left: -5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="metricGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor={metricConfig[selectedMetric].color} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={metricConfig[selectedMetric].color} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                  />
                  <YAxis 
                    domain={metricConfig[selectedMetric].domain}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    unit={` ${metricConfig[selectedMetric].unit}`}
                  />
                  <Tooltip content={<CustomMonthlyTooltip />} />
                  <ReferenceLine 
                    y={metricConfig[selectedMetric].refLine} 
                    stroke="#f43f5e" 
                    strokeDasharray="4 4"
                    label={{ 
                      value: metricConfig[selectedMetric].refLabel, 
                      position: 'insideTopRight',
                      fill: '#f43f5e',
                      fontSize: 10,
                      fontWeight: 600
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke={metricConfig[selectedMetric].color} 
                    strokeWidth={3}
                    fill="url(#metricGrad)"
                    dot={{ r: 5, fill: metricConfig[selectedMetric].color, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* SECTION 1B: Original Monthly Trend Cards (ตัวเลขรูปแบบเดิม) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              สรุปข้อมูลตัวเลขรายเดือน (Monthly Summary Metrics)
            </span>
            <span className="text-slate-400 text-[11px]">เปรียบเทียบการเปลี่ยนแปลงเทียบเดือนก่อนหน้า</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthStats.map((m, idx) => {
              const currentVal = selectedMetric === 'sugar' 
                ? m.avgSugar 
                : selectedMetric === 'sbp' 
                ? m.avgSbp 
                : selectedMetric === 'bmi' 
                ? m.avgBmi 
                : m.avgSugar;

              const unit = selectedMetric === 'sugar' 
                ? 'mg/dL' 
                : selectedMetric === 'sbp' 
                ? 'mmHg' 
                : selectedMetric === 'bmi' 
                ? 'kg/m²' 
                : 'mg/dL';

              const prevVal = idx > 0 
                ? (selectedMetric === 'sugar' 
                    ? monthStats[idx - 1].avgSugar 
                    : selectedMetric === 'sbp' 
                    ? monthStats[idx - 1].avgSbp 
                    : selectedMetric === 'bmi' 
                    ? monthStats[idx - 1].avgBmi 
                    : monthStats[idx - 1].avgSugar) 
                : currentVal;

              const diff = (currentVal - prevVal).toFixed(1);

              return (
                <div 
                  key={m.month}
                  className="p-4 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50/60 to-white hover:border-slate-300 shadow-2xs transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800">{m.monthName}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 font-semibold text-slate-700">
                      {m.count} ราย
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-extrabold text-slate-900">{currentVal}</span>
                      <span className="text-xs text-slate-500 ml-1.5">{unit}</span>
                      {selectedMetric === 'all' && (
                        <span className="block text-[11px] text-emerald-700 font-medium">ค่าน้ำตาลเฉลี่ย</span>
                      )}
                    </div>
                    {idx > 0 && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                        Number(diff) > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {Number(diff) > 0 ? `+${diff}` : diff} {unit}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <span>กลุ่มเสี่ยงสูง:</span>
                      <strong className="text-rose-600 font-bold">
                        {m.highRiskCount} ราย ({m.count > 0 ? ((m.highRiskCount/m.count)*100).toFixed(0) : 0}%)
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>SBP เฉลี่ย:</span>
                      <span className="font-semibold text-slate-800">{m.avgSbp} mmHg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>น้ำตาลเฉลี่ย:</span>
                      <span className="font-semibold text-slate-800">{m.avgSugar} mg/dL</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>BMI เฉลี่ย:</span>
                      <span className="font-semibold text-slate-800">{m.avgBmi} kg/m²</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 2. Age Groups Analysis & High Risk by Age Group */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* กลุ่มอายุที่มีความเสี่ยงสูง */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
                <Users className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  กลุ่มอายุที่มีความเสี่ยงสูง (High Risk by Age Group)
                </h3>
                <p className="text-xs text-slate-500">
                  สัดส่วนผู้มีความเสี่ยงสูงและค่าความดัน/น้ำตาลในแต่ละช่วงอายุ
                </p>
              </div>
            </div>
          </div>

          {/* Age Group Breakdown Bars */}
          <div className="space-y-3.5 pt-1">
            {ageStats.map((group) => {
              const isDanger = group.highRiskPct >= 50;
              return (
                <div key={group.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <span>{group.range}</span>
                      <span className="text-slate-400 font-normal">({group.count} ราย)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">
                        FBS: {group.avgSugar} | SBP: {group.avgSbp}
                      </span>
                      <span className={`font-bold px-2 py-0.5 rounded-md ${
                        isDanger 
                          ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        เสี่ยงสูง {group.highRiskPct}% ({group.highRiskCount} คน)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDanger 
                          ? 'bg-gradient-to-r from-amber-500 to-rose-600' 
                          : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                      style={{ width: `${Math.max(group.highRiskPct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>ข้อค้นพบสำคัญ:</strong> กลุ่มอายุ <strong>50 ปีขึ้นไป</strong> มีอัตราความเสี่ยงสูงเกิน <strong>80%</strong> เนื่องจากอายุที่เพิ่มขึ้นร่วมกับภาวะน้ำหนักเกินและกิจกรรมทางกายที่ลดลง
            </span>
          </div>
        </div>

        {/* พื้นที่ที่มีผู้เสี่ยงสูง */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-200">
                <MapPin className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-800">
                  พื้นที่ที่มีผู้เสี่ยงสูง (High Risk by Geographic Area)
                </h3>
                <p className="text-xs text-slate-500">
                  เปรียบเทียบ 5 พื้นที่ให้บริการ (ใต้, ตะวันออก, เหนือ, ตะวันตก, เมือง)
                </p>
              </div>
            </div>
          </div>

          {/* Area Comparison Cards / List */}
          <div className="space-y-2.5 pt-1">
            {areaStats
              .slice()
              .sort((a, b) => b.highRiskPct - a.highRiskPct)
              .map((a, idx) => {
                const isTopRisk = idx === 0 || a.highRiskPct >= 50;
                return (
                  <div 
                    key={a.area}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      isTopRisk
                        ? 'bg-rose-50/40 border-rose-200/80'
                        : 'bg-slate-50/60 border-slate-200/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isTopRisk ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 text-sm">พื้นที่ {a.area}</span>
                        <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>คัดกรอง: {a.count} ราย</span>
                          <span>•</span>
                          <span>สูบบุหรี่: {a.smokingCount} คน</span>
                          <span>•</span>
                          <span>น้ำตาลเฉลี่ย: {a.avgSugar}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg ${
                        isTopRisk
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        เสี่ยงสูง {a.highRiskPct}%
                      </span>
                      <span className="block text-[10px] text-slate-500 mt-0.5">
                        ({a.highRiskCount}/{a.count} ราย)
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="p-3 rounded-xl bg-violet-50/80 border border-violet-200/80 text-xs text-violet-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <span>
              <strong>พื้นที่เฝ้าระวังพิเศษ:</strong> พื้นที่ <strong>ใต้</strong> และ <strong>ตะวันออก</strong> มีสัดส่วนผู้มีความเสี่ยงสูงมากกว่า 60% ควรเน้นการจัดกิจกรรมตรวจคัดกรองเชิงรุกและรณรงค์ลดหวานมันเค็ม
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
