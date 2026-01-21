import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoBadgeProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const InfoBadge: React.FC<InfoBadgeProps> = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
      <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-slate-500">
        <Icon size={12} /> {label}
      </span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
};

export default InfoBadge;