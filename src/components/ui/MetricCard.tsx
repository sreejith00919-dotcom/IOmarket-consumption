import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  accentColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subLabel, accentColor }) => {
  return (
    <div className="bg-white border border-[#ddd] rounded-[2px] p-[10px_12px] flex flex-col relative" style={{ borderTop: `3px solid ${accentColor}` }}>
      <span className="text-[11px] text-[#666] tracking-tight">{label}</span>
      <span className="text-[20px] font-bold text-[#333] leading-tight my-[2px]">{value}</span>
      {subLabel && <span className="text-[10px] text-[#888]">{subLabel}</span>}
    </div>
  );
};
