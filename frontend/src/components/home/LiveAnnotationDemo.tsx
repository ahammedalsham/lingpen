'use client';

import { motion } from "framer-motion";

const rows = [
  ["1","LingPen","PROPN","4","nsubj"],
  ["2","is","AUX","4","cop"],
  ["3","an","DET","5","det"],
  ["4","annotation","NOUN","0","root"],
  ["5","tool","NOUN","4","xcomp"],
  ["6",".","PUNCT","4","punct"],
];

const arcs = [
  { from:1,to:4,label:"nsubj",level:2 },
  { from:2,to:4,label:"cop",level:1 },
  { from:3,to:5,label:"det",level:1 },
  { from:4,to:0,label:"root",root:true },
  { from:5,to:4,label:"xcomp",level:2 },
  { from:6,to:4,label:"punct",level:3 }
];

export default function LiveAnnotationDemo(){

  const spacing=90;
  const startX=80;
  const baseline=220;

  return(
    <div className="relative h-[500px] overflow-hidden">

      {/* Conllu Table */}

      <motion.div
      animate={{
        opacity:[0,1,1,1,0],
      }}
      transition={{
        duration:10,
        repeat:Infinity
      }}
      className="px-5 py-5"
      >

      <div className="rounded-lg overflow-hidden border border-white/10">

      <table className="w-full text-sm">

      <thead className="bg-gradient-to-r from-black/50 to-black/30 border-b border-white/10">
      <tr className="text-slate-400 font-mono text-xs uppercase tracking-wide">
        <th className="p-3">ID</th>
        <th>Form</th>
        <th>UPOS</th>
        <th>Head</th>
        <th>DepRel</th>
      </tr>
      </thead>

      <tbody>

      {rows.map((r,row)=>(

      <motion.tr
      key={row}
      initial={{opacity:0}}
      animate={{opacity:[0,1,1,1]}}
      transition={{
        duration:10,
        repeat:Infinity,
        delay:row*.6
      }}
      className="border-b border-white/5 text-center hover:bg-white/[0.03] transition-colors"
      >

      {r.map((cell,i)=>(

      <td key={i} className="py-3 px-2">

      <motion.span
      initial={{opacity:0}}
      animate={{
      opacity:[0,1,1]
      }}
      transition={{
      duration:10,
      repeat:Infinity,
      delay:row*.6+i*.15
      }}
      className="text-slate-200 font-mono text-sm"
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

      {/* dependency graph */}

      <motion.div
      className="mt-10"
      initial={{opacity:0}}
      animate={{
      opacity:[0,0,1,1,1,0]
      }}
      transition={{
      duration:10,
      repeat:Infinity
      }}
      >

      <svg
      viewBox="0 0 650 260"
      className="w-full"
      >

      {arcs.map((arc,i)=>{

      if(arc.root){

      return(
      <motion.g
      key={i}
      initial={{opacity:0}}
      animate={{opacity:[0,1,1,0]}}
      transition={{
      duration:10,
      repeat:Infinity,
      delay:4
      }}
      >

      <line
      x1={startX+spacing*3}
      x2={startX+spacing*3}
      y1={40}
      y2={baseline-25}
      stroke="#34d399"
      strokeDasharray="5 5"
      />

      <text
      x={startX+spacing*3+10}
      y={50}
      fill="#34d399"
      className="text-xs"
      >
      root
      </text>

      </motion.g>
      )
      }

      const x1=startX+(arc.from-1)*spacing
      const x2=startX+(arc.to-1)*spacing

      const y=baseline-(arc.level*35)

      return(

      <motion.g
      key={i}
      initial={{pathLength:0,opacity:0}}
      animate={{
      pathLength:[0,1,1],
      opacity:[0,1,1]
      }}
      transition={{
      duration:10,
      repeat:Infinity,
      delay:4+i*.3
      }}
      >

      <path
      d={`M${x1} ${baseline-20}
      V${y}
      H${x2}
      V${baseline-20}`}
      stroke="#6366f1"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      />

      <text
      x={(x1+x2)/2}
      y={y-10}
      textAnchor="middle"
      fill="#cbd5e1"
      className="text-xs font-medium"
      fontWeight="500"
      >
      {arc.label}
      </text>

      </motion.g>

      )

      })}

      {["LingPen","is","an","annotation","tool","."]
      .map((t,i)=>(

      <text
      key={i}
      x={startX+i*spacing}
      y={baseline}
      textAnchor="middle"
      fill="#e2e8f0"
      fontSize="14"
      fontWeight="500"
      >
      {t}
      </text>

      ))}

      </svg>

      </motion.div>

      </motion.div>

    </div>
  )
}