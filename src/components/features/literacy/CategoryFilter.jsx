import React from 'react';
import { motion } from 'framer-motion';

const MotionButton = motion.button;

const GRADES = [1, 2, 3, 4, 5, 6];

/**
 * @param {object} props
 * @param {number | null} props.value - null = semua kelas
 * @param {(grade: number | null) => void} props.onChange
 */
const CategoryFilter = ({ value, onChange }) => {
  const isAll = value === null || value === undefined;

  return (
    <div className="w-full">
      <p className="mb-3 text-sm font-bold text-slate-600">Filter kelas</p>
      <div
        className="flex flex-wrap gap-2 sm:gap-3"
        role="group"
        aria-label="Filter materi berdasarkan kelas"
      >
        <MotionButton
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(null)}
          className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            isAll
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
          aria-pressed={isAll}
        >
          Semua
        </MotionButton>
        {GRADES.map((g) => {
          const active = !isAll && Number(value) === g;
          return (
            <MotionButton
              key={g}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onChange(g)}
              className={`min-h-[44px] min-w-[44px] rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
              aria-pressed={active}
            >
              Kelas {g}
            </MotionButton>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
