'use client';

import { motion } from "framer-motion";

const rows = [
  ["1", "LingPen", "PROPN", "4", "nsubj"],
  ["2", "is", "AUX", "4", "cop"],
  ["3", "an", "DET", "5", "det"],
  ["4", "annotation", "NOUN", "0", "root"],
  ["5", "tool", "NOUN", "4", "xcomp"],
  ["6", ".", "PUNCT", "4", "punct"],
];

const arcs = [
  { from: 1, to: 4, label: "nsubj", level: 2 },
  { from: 2, to: 4, label: "cop", level: 1 },
  { from: 3, to: 5, label: "det", level: 1 },
  { from: 4, to: 0, label: "root", root: true },
  { from: 5, to: 4, label: "xcomp", level: 2 },
  { from: 6, to: 4, label: "punct", level: 3 }
];

export default function LiveAnnotationDemo() {
  const spacing = 90;
  const startX = 80;
  const baseline = 220;

  return (
    // Removed the fixed h-[500px] - using flex to let content size naturally
    <div className="relative flex flex-col w-full">
      
      {/* Conllu Table */}
      <motion.div
        animate={{ opacity: [0, 1, 1, 1, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="px-6 py-5"
      >
        <div className="rounded-lg overflow-hidden border border-white/10 bg-black/20">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-black/60 to-black/40 border-b border-white/10">
              <tr className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="p-2.5 font-semibold text-left pl-4">ID</th>
                <th className="p-2.5 font-semibold text-left">Form</th>
                <th className="p-2.5 font-semibold text-left">UPOS</th>
                <th className="p-2.5 font-semibold text-left">Head</th>
                <th className="p-2.5 font-semibold text-left">DepRel</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, row) => (
                <motion.tr
                  key={row}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 1, 0] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: row * 0.4
                  }}
                  className="border-b border-white/5 hover:bg-white/[0.04] transition-colors"
                >
                  {r.map((cell, i) => (
                    <td key={i} className={`py-2 px-2.5 ${i === 0 ? 'pl-4' : ''}`}>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 1, 0] }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          delay: (row * 0.4) + (i * 0.1)
                        }}
                        className="text-slate-200 font-mono text-[13px]"
                      >
                        {cell}
                      </motion.span>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Dependency Graph */}
      <motion.div
        className="px-2 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 1, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        {/* Adjusted viewBox slightly to prevent root cutoff */}
        <svg viewBox="0 -10 650 270" className="w-full h-auto drop-shadow-lg">
          {arcs.map((arc, i) => {
            if (arc.root) {
              return (
                <motion.g
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 1, 0] }}
                  transition={{ duration: 10, repeat: Infinity, delay: 4 }}
                >
                  <line
                    x1={startX + spacing * 3}
                    x2={startX + spacing * 3}
                    y1={20}
                    y2={baseline - 25}
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                  <text
                    x={startX + spacing * 3 + 10}
                    y={30}
                    fill="#34d399"
                    className="text-[11px] font-mono font-semibold"
                  >
                    root
                  </text>
                </motion.g>
              );
            }

            const x1 = startX + (arc.from - 1) * spacing;
            const x2 = startX + (arc.to - 1) * spacing;
            const y = baseline - (arc.level * 35);

            return (
              <motion.g
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 1, 0] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  delay: 4 + i * 0.3
                }}
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1, 1, 0] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: 4 + i * 0.3
                  }}
                  d={`M${x1} ${baseline - 20} V${y} H${x2} V${baseline - 20}`}
                  stroke="#818CF8" // Slightly lighter indigo for better contrast
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  className="text-[11px] font-mono font-medium"
                >
                  {arc.label}
                </text>
              </motion.g>
            );
          })}

          {["LingPen", "is", "an", "annotation", "tool", "."].map((t, i) => (
            <text
              key={i}
              x={startX + i * spacing}
              y={baseline + 5}
              textAnchor="middle"
              fill="#F8FAFC"
              fontSize="15"
              fontWeight="500"
              className="tracking-wide"
            >
              {t}
            </text>
          ))}
        </svg>
      </motion.div>

    </div>
  );
}