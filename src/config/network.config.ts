import { Activity, Heart } from 'lucide-react';
import { NetworkStat } from '../types';

export const networkStats: NetworkStat[] = [
  { 
    icon: Activity, 
    label: 'Network Status', 
    value: 'Active', 
    color: 'text-green-400 animate-rainbow' 
  },
];
