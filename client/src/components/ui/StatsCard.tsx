import React from 'react';
import { BoxIcon } from 'lucide-react';
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: BoxIcon;
  description?: string;
}
export function StatsCard({
  title,
  value,
  icon: Icon,
  description
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start space-x-4">
      <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {description &&
        <p className="text-sm text-slate-500 mt-1">{description}</p>
        }
      </div>
    </div>);

}