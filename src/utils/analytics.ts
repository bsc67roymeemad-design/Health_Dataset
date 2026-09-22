import { HealthRecord } from '../types';

export interface HealthStats {
  total: number;
  avgBmi: number;
  minBmi: number;
  maxBmi: number;
  avgSugar: number;
  minSugar: number;
  maxSugar: number;
  avgSbp: number;
  minSbp: number;
  maxSbp: number;
  avgDbp: number;
  avgPulse: number;
  avgAge: number;
  highRiskCount: number;
  highRiskPct: number;
  medRiskCount: number;
  medRiskPct: number;
  lowRiskCount: number;
  lowRiskPct: number;
  smokingCount: number;
  smokingPct: number;
  alcoholCount: number;
  alcoholPct: number;
  noExerciseCount: number;
  noExercisePct: number;
  regularExerciseCount: number;
  regularExercisePct: number;
  someExerciseCount: number;
  someExercisePct: number;
  diabetesRiskCount: number;
  diabetesRiskPct: number;
  hypertensionRiskCount: number;
  hypertensionRiskPct: number;
}

export function calculateHealthStats(records: HealthRecord[]): HealthStats {
  const total = records.length;
  if (total === 0) {
    return {
      total: 0,
      avgBmi: 0, minBmi: 0, maxBmi: 0,
      avgSugar: 0, minSugar: 0, maxSugar: 0,
      avgSbp: 0, minSbp: 0, maxSbp: 0,
      avgDbp: 0, avgPulse: 0, avgAge: 0,
      highRiskCount: 0, highRiskPct: 0,
      medRiskCount: 0, medRiskPct: 0,
      lowRiskCount: 0, lowRiskPct: 0,
      smokingCount: 0, smokingPct: 0,
      alcoholCount: 0, alcoholPct: 0,
      noExerciseCount: 0, noExercisePct: 0,
      regularExerciseCount: 0, regularExercisePct: 0,
      someExerciseCount: 0, someExercisePct: 0,
      diabetesRiskCount: 0, diabetesRiskPct: 0,
      hypertensionRiskCount: 0, hypertensionRiskPct: 0,
    };
  }

  const bmis = records.map(r => r.bmi);
  const sugars = records.map(r => r.bloodSugar);
  const sbps = records.map(r => r.sbp);
  const dbps = records.map(r => r.dbp);
  const pulses = records.map(r => r.pulse);
  const ages = records.map(r => r.age);

  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

  const highRiskCount = records.filter(r => r.riskLevel === 'สูง').length;
  const medRiskCount = records.filter(r => r.riskLevel === 'ปานกลาง').length;
  const lowRiskCount = records.filter(r => r.riskLevel === 'ต่ำ').length;

  const smokingCount = records.filter(r => r.smoking === 'สูบ').length;
  const alcoholCount = records.filter(r => r.alcohol === 'ดื่ม').length;
  const noExerciseCount = records.filter(r => r.exercise === 'ไม่ออกกำลังกาย').length;
  const regularExerciseCount = records.filter(r => r.exercise === 'สม่ำเสมอ').length;
  const someExerciseCount = records.filter(r => r.exercise === 'บางครั้ง').length;

  const diabetesRiskCount = records.filter(r => r.diabetesRisk === 'มีแนวโน้ม/เสี่ยง').length;
  const hypertensionRiskCount = records.filter(r => r.hypertensionRisk === 'มีแนวโน้ม/เสี่ยง').length;

  return {
    total,
    avgBmi: Number((sum(bmis) / total).toFixed(1)),
    minBmi: Math.min(...bmis),
    maxBmi: Math.max(...bmis),
    avgSugar: Number((sum(sugars) / total).toFixed(1)),
    minSugar: Math.min(...sugars),
    maxSugar: Math.max(...sugars),
    avgSbp: Number((sum(sbps) / total).toFixed(1)),
    minSbp: Math.min(...sbps),
    maxSbp: Math.max(...sbps),
    avgDbp: Number((sum(dbps) / total).toFixed(1)),
    avgPulse: Number((sum(pulses) / total).toFixed(1)),
    avgAge: Number((sum(ages) / total).toFixed(1)),
    highRiskCount,
    highRiskPct: Number(((highRiskCount / total) * 100).toFixed(1)),
    medRiskCount,
    medRiskPct: Number(((medRiskCount / total) * 100).toFixed(1)),
    lowRiskCount,
    lowRiskPct: Number(((lowRiskCount / total) * 100).toFixed(1)),
    smokingCount,
    smokingPct: Number(((smokingCount / total) * 100).toFixed(1)),
    alcoholCount,
    alcoholPct: Number(((alcoholCount / total) * 100).toFixed(1)),
    noExerciseCount,
    noExercisePct: Number(((noExerciseCount / total) * 100).toFixed(1)),
    regularExerciseCount,
    regularExercisePct: Number(((regularExerciseCount / total) * 100).toFixed(1)),
    someExerciseCount,
    someExercisePct: Number(((someExerciseCount / total) * 100).toFixed(1)),
    diabetesRiskCount,
    diabetesRiskPct: Number(((diabetesRiskCount / total) * 100).toFixed(1)),
    hypertensionRiskCount,
    hypertensionRiskPct: Number(((hypertensionRiskCount / total) * 100).toFixed(1)),
  };
}

export interface AgeGroupStat {
  range: string;
  count: number;
  highRiskCount: number;
  highRiskPct: number;
  avgBmi: number;
  avgSugar: number;
  avgSbp: number;
}

export function getAgeGroupStats(records: HealthRecord[]): AgeGroupStat[] {
  const groups = [
    { range: '20-29 ปี', min: 20, max: 29 },
    { range: '30-39 ปี', min: 30, max: 39 },
    { range: '40-49 ปี', min: 40, max: 49 },
    { range: '50-59 ปี', min: 50, max: 59 },
    { range: '60 ปีขึ้นไป', min: 60, max: 120 },
  ];

  return groups.map(g => {
    const subset = records.filter(r => r.age >= g.min && r.age <= g.max);
    const count = subset.length;
    const highRiskCount = subset.filter(r => r.riskLevel === 'สูง').length;
    const avgBmi = count > 0 ? Number((subset.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1)) : 0;
    const avgSugar = count > 0 ? Number((subset.reduce((acc, r) => acc + r.bloodSugar, 0) / count).toFixed(1)) : 0;
    const avgSbp = count > 0 ? Number((subset.reduce((acc, r) => acc + r.sbp, 0) / count).toFixed(1)) : 0;

    return {
      range: g.range,
      count,
      highRiskCount,
      highRiskPct: count > 0 ? Number(((highRiskCount / count) * 100).toFixed(1)) : 0,
      avgBmi,
      avgSugar,
      avgSbp,
    };
  });
}

export interface AreaStat {
  area: string;
  count: number;
  highRiskCount: number;
  highRiskPct: number;
  avgSugar: number;
  avgSbp: number;
  smokingCount: number;
}

export function getAreaStats(records: HealthRecord[]): AreaStat[] {
  const areas = ['เมือง', 'เหนือ', 'ตะวันออก', 'ตะวันตก', 'ใต้'];
  return areas.map(area => {
    const subset = records.filter(r => r.area === area);
    const count = subset.length;
    const highRiskCount = subset.filter(r => r.riskLevel === 'สูง').length;
    const smokingCount = subset.filter(r => r.smoking === 'สูบ').length;
    const avgSugar = count > 0 ? Number((subset.reduce((acc, r) => acc + r.bloodSugar, 0) / count).toFixed(1)) : 0;
    const avgSbp = count > 0 ? Number((subset.reduce((acc, r) => acc + r.sbp, 0) / count).toFixed(1)) : 0;

    return {
      area,
      count,
      highRiskCount,
      highRiskPct: count > 0 ? Number(((highRiskCount / count) * 100).toFixed(1)) : 0,
      avgSugar,
      avgSbp,
      smokingCount,
    };
  });
}

export interface MonthTrendStat {
  month: string;
  monthName: string;
  count: number;
  highRiskCount: number;
  avgSugar: number;
  avgSbp: number;
  avgBmi: number;
}

export function getMonthTrendStats(records: HealthRecord[]): MonthTrendStat[] {
  const months = [
    { key: '2026-01', name: 'ม.ค. 2026' },
    { key: '2026-02', name: 'ก.พ. 2026' },
    { key: '2026-03', name: 'มี.ค. 2026' },
  ];

  return months.map(m => {
    const subset = records.filter(r => r.month === m.key);
    const count = subset.length;
    const highRiskCount = subset.filter(r => r.riskLevel === 'สูง').length;
    const avgSugar = count > 0 ? Number((subset.reduce((acc, r) => acc + r.bloodSugar, 0) / count).toFixed(1)) : 0;
    const avgSbp = count > 0 ? Number((subset.reduce((acc, r) => acc + r.sbp, 0) / count).toFixed(1)) : 0;
    const avgBmi = count > 0 ? Number((subset.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1)) : 0;

    return {
      month: m.key,
      monthName: m.name,
      count,
      highRiskCount,
      avgSugar,
      avgSbp,
      avgBmi,
    };
  });
}

export interface ExerciseImpactStat {
  level: string;
  label: string;
  count: number;
  avgSugar: number;
  avgSbp: number;
  avgBmi: number;
  avgScore: number;
  highRiskPct: number;
}

export function getExerciseImpactStats(records: HealthRecord[]): ExerciseImpactStat[] {
  const levels = [
    { level: 'สม่ำเสมอ', label: 'ออกกำลังกายสม่ำเสมอ' },
    { level: 'บางครั้ง', label: 'ออกกำลังกายบางครั้ง' },
    { level: 'ไม่ออกกำลังกาย', label: 'ไม่ออกกำลังกาย' },
  ];

  return levels.map(l => {
    const subset = records.filter(r => r.exercise === l.level);
    const count = subset.length;
    const highRiskCount = subset.filter(r => r.riskLevel === 'สูง').length;
    const avgSugar = count > 0 ? Number((subset.reduce((acc, r) => acc + r.bloodSugar, 0) / count).toFixed(1)) : 0;
    const avgSbp = count > 0 ? Number((subset.reduce((acc, r) => acc + r.sbp, 0) / count).toFixed(1)) : 0;
    const avgBmi = count > 0 ? Number((subset.reduce((acc, r) => acc + r.bmi, 0) / count).toFixed(1)) : 0;
    const avgScore = count > 0 ? Number((subset.reduce((acc, r) => acc + r.riskScore, 0) / count).toFixed(1)) : 0;

    return {
      level: l.level,
      label: l.label,
      count,
      avgSugar,
      avgSbp,
      avgBmi,
      avgScore,
      highRiskPct: count > 0 ? Number(((highRiskCount / count) * 100).toFixed(1)) : 0,
    };
  });
}
