export interface HealthRecord {
  id: string;              // รหัสบุคคล เช่น H0001
  screenDate: string;      // วันที่คัดกรอง เช่น 3/1/2026
  area: string;            // พื้นที่ เช่น เมือง, เหนือ, ตะวันออก, ตะวันตก, ใต้
  gender: 'ชาย' | 'หญิง' | string; // เพศ
  age: number;             // อายุ
  heightCm: number;        // ส่วนสูง_cm
  weightKg: number;        // น้ำหนัก_kg
  bmi: number;             // BMI
  sbp: number;             // SBP_mmHg
  dbp: number;             // DBP_mmHg
  pulse: number;           // ชีพจร_bpm
  bloodSugar: number;      // น้ำตาล_mg_dL
  smoking: 'สูบ' | 'ไม่สูบ' | string;       // สูบบุหรี่
  alcohol: 'ดื่ม' | 'ไม่ดื่ม' | string;     // ดื่มแอลกอฮอล์
  exercise: 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย' | string; // การออกกำลังกาย
  diabetesRisk: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;       // เบาหวาน_คัดกรอง
  hypertensionRisk: 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง' | string;   // ความดันโลหิตสูง_คัดกรอง
  riskScore: number;       // คะแนนความเสี่ยง (0-7)
  riskLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง' | string; // ระดับความเสี่ยง
  month: string;           // เดือน เช่น 2026-01, 2026-02, 2026-03
}

export interface FilterState {
  smoking: string;         // 'ทั้งหมด' | 'สูบ' | 'ไม่สูบ'
  alcohol: string;         // 'ทั้งหมด' | 'ดื่ม' | 'ไม่ดื่ม'
  exercise: string;        // 'ทั้งหมด' | 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย'
  diabetesRisk: string;    // 'ทั้งหมด' | 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง'
  hypertensionRisk: string;// 'ทั้งหมด' | 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง'
  area: string;            // 'ทั้งหมด' | 'เมือง' | 'เหนือ' | 'ตะวันออก' | 'ตะวันตก' | 'ใต้'
  gender: string;          // 'ทั้งหมด' | 'ชาย' | 'หญิง'
  riskLevel: string;       // 'ทั้งหมด' | 'ต่ำ' | 'ปานกลาง' | 'สูง'
  searchQuery: string;
}

export type TabSection = 'overview' | 'risk' | 'trend' | 'behavior' | 'correlation' | 'table';
