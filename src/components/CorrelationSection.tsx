import React, { useState } from 'react';
import { HealthRecord } from '../types';
import { 
  ScatterChart, 
  Info, 
  TrendingUp, 
  Droplet, 
  Activity, 
  Weight, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';

interface CorrelationSectionProps {
  records: HealthRecord[];
}

export const CorrelationSection: React.FC<CorrelationSectionProps> = ({ records }) => {
  const [hoveredRecord, setHoveredRecord] = useState<HealthRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'sugar' | 'sbp'>('sugar');

  // Chart boundaries
  const minBmi = 18;
  const maxBmi = 34;

  const minSugar = 70;
  const maxSugar = 170;

  const minSbp = 100;
  const maxSbp = 170;

  // SVG coordinate helpers
  const svgWidth = 600;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };

  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = svgHeight - padding.top - padding.bottom;

  const getX = (bmi: number) => {
    return padding.left + ((bmi - minBmi) / (maxBmi - minBmi)) * innerWidth;
  };

  const getYSugar = (sugar: number) => {
    return padding.top + innerHeight - ((sugar - minSugar) / (maxSugar - minSugar)) * innerHeight;
  };

  const getYSbp = (sbp: number) => {
    return padding.top + innerHeight - ((sbp - minSbp) / (maxSbp - minSbp)) * innerHeight;
  };

  const getRiskColor = (level: string) => {
    if (level === 'สูง') return '#f43f5e'; // rose-500
    if (level === 'ปานกลาง') return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white shadow-xs">
            <ScatterChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              ความสัมพันธ์เชิงลึก (Health Correlation Analysis)
            </h2>
            <p className="text-xs text-slate-500">
              วิเคราะห์ความสัมพันธ์ระหว่าง ดัชนีมวลกาย (BMI) กับ ระดับน้ำตาลในเลือด และ ความดันโลหิต (SBP)
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('sugar')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sugar'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-emerald-500" />
            <span>BMI กับ น้ำตาลในเลือด</span>
          </button>
          <button
            onClick={() => setActiveTab('sbp')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeTab === 'sbp'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>BMI กับ ความดัน SBP</span>
          </button>
        </div>
      </div>

      {/* Main Scatter Plot Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Scatter Plot (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600" />
              {activeTab === 'sugar' 
                ? 'แผนภาพการกระจาย: ดัชนีมวลกาย (BMI) เทียบกับ ระดับน้ำตาล (Blood Sugar)' 
                : 'แผนภาพการกระจาย: ดัชนีมวลกาย (BMI) เทียบกับ ความดันโลหิตตัวบน (SBP)'}
            </h3>
            <span className="text-xs text-slate-400">
              *ชี้เมาส์ที่จุดเพื่อดูรายละเอียดผู้คัดกรอง
            </span>
          </div>

          {/* SVG Canvas with Responsive ViewBox */}
          <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-xl border border-slate-100 p-2">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto select-none"
            >
              {/* Grid Lines & Labels */}
              {/* Horizontal Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = padding.top + innerHeight * (1 - ratio);
                const val = activeTab === 'sugar'
                  ? Math.round(minSugar + ratio * (maxSugar - minSugar))
                  : Math.round(minSbp + ratio * (maxSbp - minSbp));
                return (
                  <g key={ratio}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[11px] fill-slate-400 font-mono"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Vertical Grid */}
              {[20, 23, 26, 29, 32].map((bmiVal) => {
                const x = getX(bmiVal);
                return (
                  <g key={bmiVal}>
                    <line
                      x1={x}
                      y1={padding.top}
                      x2={x}
                      y2={svgHeight - padding.bottom}
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={x}
                      y={svgHeight - padding.bottom + 18}
                      textAnchor="middle"
                      className="text-[11px] fill-slate-400 font-mono"
                    >
                      {bmiVal}
                    </text>
                  </g>
                );
              })}

              {/* Threshold Reference Lines */}
              {/* BMI 25 Line (Obesity Threshold) */}
              <line
                x1={getX(25)}
                y1={padding.top}
                x2={getX(25)}
                y2={svgHeight - padding.bottom}
                stroke="#f97316"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={getX(25) + 4}
                y={padding.top + 14}
                className="text-[10px] fill-amber-600 font-semibold"
              >
                เกณฑ์อ้วน (BMI 25)
              </text>

              {/* Sugar 126 or SBP 140 Reference Line */}
              {activeTab === 'sugar' ? (
                <>
                  <line
                    x1={padding.left}
                    y1={getYSugar(126)}
                    x2={svgWidth - padding.right}
                    y2={getYSugar(126)}
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={svgWidth - padding.right - 4}
                    y={getYSugar(126) - 6}
                    textAnchor="end"
                    className="text-[10px] fill-rose-600 font-semibold"
                  >
                    เกณฑ์เบาหวาน (126 mg/dL)
                  </text>
                </>
              ) : (
                <>
                  <line
                    x1={padding.left}
                    y1={getYSbp(140)}
                    x2={svgWidth - padding.right}
                    y2={getYSbp(140)}
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={svgWidth - padding.right - 4}
                    y={getYSbp(140) - 6}
                    textAnchor="end"
                    className="text-[10px] fill-rose-600 font-semibold"
                  >
                    ความดันสูง (140 mmHg)
                  </text>
                </>
              )}

              {/* Data Points */}
              {records.map((r) => {
                const cx = getX(r.bmi);
                const cy = activeTab === 'sugar' ? getYSugar(r.bloodSugar) : getYSbp(r.sbp);
                const isHovered = hoveredRecord?.id === r.id;
                const dotColor = getRiskColor(r.riskLevel);

                return (
                  <g key={r.id}>
                    {/* Outer pulse when hovered */}
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill={dotColor}
                        opacity={0.3}
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 8 : 6}
                      fill={dotColor}
                      stroke="#ffffff"
                      strokeWidth={2}
                      className="cursor-pointer transition-all duration-150 drop-shadow-xs"
                      onMouseEnter={() => setHoveredRecord(r)}
                      onMouseLeave={() => setHoveredRecord(null)}
                    />
                  </g>
                );
              })}

              {/* Axis Titles */}
              <text
                x={svgWidth / 2}
                y={svgHeight - 12}
                textAnchor="middle"
                className="text-xs fill-slate-600 font-semibold"
              >
                ดัชนีมวลกาย (BMI kg/m²)
              </text>

              <text
                x={-svgHeight / 2}
                y={18}
                textAnchor="middle"
                transform="rotate(-90)"
                className="text-xs fill-slate-600 font-semibold"
              >
                {activeTab === 'sugar' ? 'ระดับน้ำตาลในเลือด (mg/dL)' : 'ความดันโลหิตตัวบน (SBP mmHg)'}
              </text>
            </svg>
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-4">
              <span className="text-slate-500 font-medium">ระดับความเสี่ยง:</span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> เสี่ยงต่ำ
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> เสี่ยงปานกลาง
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> เสี่ยงสูง
              </span>
            </div>
          </div>
        </div>

        {/* Hovered Details & Clinical Insights Panel (1 Col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-violet-600" />
              รายละเอียดจุดข้อมูลที่เลือก
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              ข้อมูลคัดกรองรายบุคคลจากการชี้จุดในแผนภาพ
            </p>

            {hoveredRecord ? (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">
                    รหัส: {hoveredRecord.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                    hoveredRecord.riskLevel === 'สูง'
                      ? 'bg-rose-100 text-rose-700'
                      : hoveredRecord.riskLevel === 'ปานกลาง'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    เสี่ยง{hoveredRecord.riskLevel} (คะแนน {hoveredRecord.riskScore})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">อายุ / เพศ</span>
                    <span className="font-bold text-slate-800">{hoveredRecord.age} ปี ({hoveredRecord.gender})</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">พื้นที่</span>
                    <span className="font-bold text-slate-800">{hoveredRecord.area}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">BMI</span>
                    <span className="font-bold text-cyan-700">{hoveredRecord.bmi} kg/m²</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">น้ำตาล FBS</span>
                    <span className="font-bold text-emerald-700">{hoveredRecord.bloodSugar} mg/dL</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">ความดัน SBP</span>
                    <span className="font-bold text-blue-700">{hoveredRecord.sbp} mmHg</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">การออกกำลังกาย</span>
                    <span className="font-bold text-slate-800">{hoveredRecord.exercise}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  สูบบุหรี่: <strong>{hoveredRecord.smoking}</strong> | แอลกอฮอล์: <strong>{hoveredRecord.alcohol}</strong>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-8 text-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200 text-xs text-slate-400">
                เลื่อนเมาส์ไปวางบนจุดกลมในกราฟเพื่อดูข้อมูลรายบุคคลแบบเรียลไทม์
              </div>
            )}
          </div>

          {/* Statistical Correlation Takeaways */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200/80 text-xs text-slate-700 space-y-2">
            <span className="font-bold text-cyan-900 block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              สรุปความสัมพันธ์ทางระบาดวิทยา:
            </span>
            <p className="leading-relaxed text-[11px]">
              {activeTab === 'sugar' ? (
                <>
                  พบ <strong>ความสัมพันธ์เชิงบวกอย่างมีนัยสำคัญ</strong> ระหว่างค่า BMI กับระดับน้ำตาลในเลือด ผู้ที่มีค่า BMI สูงกว่า 28 kg/m² เกือบทั้งหมดมีระดับน้ำตาลเกินเกณฑ์ปกติ (≥100 mg/dL)
                </>
              ) : (
                <>
                  ค่า BMI สัมพันธ์โดยตรงกับความดันโลหิตตัวบน (SBP) อย่างเห็นได้ชัด ประชากรกลุ่มที่มีภาวะอ้วน (BMI ≥ 25) มีค่า SBP เฉลี่ยสูงกว่ากลุ่มสมส่วนถึง <strong>28 mmHg</strong>
                </>
              )}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
