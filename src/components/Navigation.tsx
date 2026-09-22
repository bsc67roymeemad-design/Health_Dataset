import React from 'react';
import { TabSection } from '../types';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  TrendingUp, 
  HeartHandshake, 
  ScatterChart, 
  TableProperties
} from 'lucide-react';

interface NavigationProps {
  activeTab: TabSection;
  onSelectTab: (tab: TabSection) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    {
      id: 'overview' as TabSection,
      label: 'ภาพรวมและดัชนีชี้วัด',
      sublabel: 'Overview & KPIs',
      icon: LayoutDashboard,
      color: 'from-violet-500 to-indigo-600',
      activeBorder: 'border-violet-500 text-violet-700 bg-violet-50/70',
      pillColor: 'bg-violet-500 text-white shadow-violet-500/20'
    },
    {
      id: 'risk' as TabSection,
      label: 'การวิเคราะห์ความเสี่ยง',
      sublabel: 'Health Risk Analysis',
      icon: AlertTriangle,
      color: 'from-rose-500 to-amber-500',
      activeBorder: 'border-rose-500 text-rose-700 bg-rose-50/70',
      pillColor: 'bg-rose-500 text-white shadow-rose-500/20'
    },
    {
      id: 'trend' as TabSection,
      label: 'แนวโน้มและกลุ่มอายุ',
      sublabel: 'Health Trends & Area',
      icon: TrendingUp,
      color: 'from-amber-500 to-emerald-500',
      activeBorder: 'border-amber-500 text-amber-700 bg-amber-50/70',
      pillColor: 'bg-amber-500 text-white shadow-amber-500/20'
    },
    {
      id: 'behavior' as TabSection,
      label: 'พฤติกรรมและวิถีชีวิต',
      sublabel: 'Health Behaviors',
      icon: HeartHandshake,
      color: 'from-emerald-500 to-cyan-500',
      activeBorder: 'border-emerald-500 text-emerald-700 bg-emerald-50/70',
      pillColor: 'bg-emerald-500 text-white shadow-emerald-500/20'
    },
    {
      id: 'correlation' as TabSection,
      label: 'ความสัมพันธ์เชิงลึก',
      sublabel: 'BMI vs น้ำตาล & ความดัน',
      icon: ScatterChart,
      color: 'from-cyan-500 to-blue-500',
      activeBorder: 'border-cyan-500 text-cyan-700 bg-cyan-50/70',
      pillColor: 'bg-cyan-500 text-white shadow-cyan-500/20'
    },
    {
      id: 'table' as TabSection,
      label: 'ตารางข้อมูลเชิงลึก',
      sublabel: 'Detailed Records',
      icon: TableProperties,
      color: 'from-blue-500 to-violet-500',
      activeBorder: 'border-blue-500 text-blue-700 bg-blue-50/70',
      pillColor: 'bg-blue-600 text-white shadow-blue-500/20'
    },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-2 shadow-xs overflow-x-auto scrollbar-thin">
      <div className="flex items-center min-w-max md:min-w-0 md:grid md:grid-cols-6 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex flex-col items-center justify-center text-center px-3 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                isActive
                  ? `${tab.pillColor} shadow-md font-bold scale-[1.02]`
                  : 'bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate whitespace-nowrap">{tab.label}</span>
              </div>
              <span className={`text-[10px] hidden sm:block ${isActive ? 'text-white/80 font-normal' : 'text-slate-400'}`}>
                {tab.sublabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
