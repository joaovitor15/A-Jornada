import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ICONS } from '../pages/Categories';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  color?: string;
  label?: string;
  optional?: boolean;
}

export default function IconPicker({ value, onChange, color, label = "Ícone", optional = false }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const SelectedIcon = value ? ICONS.find(i => i.name === value)?.component || Tag : Tag;

  return (
    <div className="flex flex-col gap-[8px] relative w-full" ref={selectorRef}>
      <label className="block text-[12px] font-[700] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-[2px]">
        {label} {optional && "(Opcional)"}
      </label>
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        className="flex items-center justify-between w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1.5px] border-[#E2E8F0] dark:border-[#334155] rounded-[10px] px-[14px] py-[8px] min-h-[44px] cursor-pointer hover:border-[#2563EB] transition-colors"
      >
        <div className="flex items-center gap-[10px]">
          <div 
            className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center text-white bg-[#94A3B8]"
            style={color ? { backgroundColor: color } : {}}
          >
            <SelectedIcon size={16} />
          </div>
          <span className="text-[14px] text-[#374151] dark:text-[#E2E8F0] font-medium capitalize">
            {value || 'Automático'}
          </span>
        </div>
        <ChevronDown size={14} className="text-[#94A3B8] dark:text-[#475569]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-[calc(100%+40px)] -ml-[20px] sm:ml-0 sm:w-full min-w-[300px] sm:min-w-[340px] bg-[#FFFFFF] dark:bg-[#1E293B] border-[1px] border-[#E2E8F0] dark:border-[#334155] rounded-[10px] flex flex-col gap-[12px] overflow-hidden p-[14px] shadow-sm transform-origin-top absolute top-[100%] mt-[8px] z-[50]"
          >
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Buscar ícone..."
                value={searchTerm}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#0F172A] border-[1px] border-[#E2E8F0] dark:border-[#334155] rounded-[8px] py-[10px] pr-[12px] pl-[36px] text-[14px] text-[#0F172A] dark:text-white focus:outline-none focus:border-[#2563EB] transition-all"
              />
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-7 gap-[8px] overflow-y-auto max-h-[220px] icons-grid-scroll">
              {ICONS.filter(icon => icon.label.toLowerCase().includes(searchTerm.toLowerCase())).map(icon => {
                const IconComponent = icon.component;
                const isSelected = value === icon.name;
                return (
                  <button 
                    key={icon.name}
                    title={icon.name}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange(icon.name);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="aspect-square flex items-center justify-center rounded-[8px] transition-all cursor-pointer p-[8px]"
                    style={isSelected ? {
                      backgroundColor: color || '#2563EB',
                      color: '#FFFFFF'
                    } : {
                      backgroundColor: 'transparent',
                      color: '#64748B'
                    }}
                  >
                    <IconComponent size={20} />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
