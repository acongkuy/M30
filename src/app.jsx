
import React, { useState, useEffect, useRef } from 'react';
import { Trophy } from 'lucide-react';

// ============================================================
// TEMPAT EDIT TEKS (Ubah semua isi kotak di sini)
// ============================================================
const BRACKET_DATA = {
  judul: "BINUS M30 TOURNAMENT ID",
  
  // ganti ini aja tiap tournament jangan sentuh kode yang lain ntar rusak.
  
  // Nama Tim (18 Tim) penyisihan
  daftarTim: [
    "TIM 1", "TIM 2", "TIM 3", "TIM 4", "TIM 5", "TIM 6", 
    "TIM 7", "TIM 8", "TIM 9", "TIM 10", "TIM 11", "TIM 12", 
    "TIM 13", "TIM 14", "TIM 15", "TIM 16", "TIM 17", "TIM 18"
  ],

  // babak qualifikasi
  matchLabels: ["QF1", "QF2", "QF3", "QF4", "QF5", "QF6", "QF7", "QF8", "QF9"],
  
  // babak Semi final 
  qfLabels: ["SF 1", "SF 2", "SF 3", "SF 4"],
  
  //babak final
  sfLabels: ["FINAL 1", "FINAL 2"],
  
  // sang juara
  finalLabel: "JUARA",
  juaraLabel: "CHAMPION",
  namaJuara: "HIDUP JAWA!!!" 
};
  //jangan pernah sentuh kode dibawah!!!!!!!!🤬😡😡😡
const App = () => {
  const [lines, setLines] = useState([]);
  const containerRef = useRef(null);
  const refs = useRef({});

  const setRef = (id, el) => { if (el) refs.current[id] = el; };

  const calculateLines = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newLines = [];

    const getPos = (id, side = 'right') => {
      const el = refs.current[id];
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: side === 'right' ? rect.right - containerRect.left : rect.left - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
      };
    };

    
    const drawBracketLine = (s1, s2, end, color) => {
      const p1 = getPos(s1);
      const p2 = getPos(s2);
      const pEnd = getPos(end, 'left');
      if (!p1 || !p2 || !pEnd) return;
      
      const midX = p1.x + (pEnd.x - p1.x) / 2;
      newLines.push({ path: `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${pEnd.y} L ${pEnd.x} ${pEnd.y}`, color });
      newLines.push({ path: `M ${p2.x} ${p2.y} L ${midX} ${p2.y} L ${midX} ${pEnd.y}`, color });
    };

  
    const drawTripleBracketLine = (s1, s2, s3, end, color) => {
      const p1 = getPos(s1);
      const p2 = getPos(s2);
      const p3 = getPos(s3);
      const pEnd = getPos(end, 'left');
      if (!p1 || !p2 || !p3 || !pEnd) return;

      const midX = p1.x + (pEnd.x - p1.x) / 2;
      newLines.push({ path: `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${pEnd.y} L ${pEnd.x} ${pEnd.y}`, color });
      newLines.push({ path: `M ${p2.x} ${p2.y} L ${midX} ${p2.y} L ${midX} ${pEnd.y}`, color });
      newLines.push({ path: `M ${p3.x} ${p3.y} L ${midX} ${p3.y} L ${midX} ${pEnd.y}`, color });
    };


    for (let i = 0; i < 9; i++) {
      drawBracketLine(`T${i * 2}`, `T${i * 2 + 1}`, `M${i}`, '#3b82f6');
    }


    drawBracketLine('M0', 'M1', 'QF0', '#a855f7'); // M1, M2 -> QF1
    drawBracketLine('M2', 'M3', 'QF1', '#a855f7'); // M3, M4 -> QF2
    drawBracketLine('M4', 'M5', 'QF2', '#a855f7'); // M5, M6 -> QF3
    
    
    drawTripleBracketLine('M6', 'M7', 'M8', 'QF3', '#a855f7');


    drawBracketLine('QF0', 'QF1', 'SF0', '#ec4899');
    drawBracketLine('QF2', 'QF3', 'SF1', '#ec4899');


    drawBracketLine('SF0', 'SF1', 'FINAL', '#ec4899');


    const fin = getPos('FINAL');
    const win = getPos('JUARA', 'left');
    if (fin && win) {
      const finRect = refs.current['FINAL'].getBoundingClientRect();
      newLines.push({ path: `M ${fin.x + finRect.width} ${fin.y} L ${win.x} ${win.y}`, color: '#fbbf24', width: 3 });
    }

    setLines(newLines);
  };

  useEffect(() => {
    const timer = setTimeout(calculateLines, 250);
    window.addEventListener('resize', calculateLines);
    return () => { window.removeEventListener('resize', calculateLines); clearTimeout(timer); };
  }, []);

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-8 font-sans select-none overflow-x-auto">
      <h1 className="text-4xl font-black italic text-center mb-16 tracking-tighter uppercase">{BRACKET_DATA.judul}</h1>
      
      <div ref={containerRef} className="relative flex gap-16 min-w-[1700px] h-[1050px] items-start px-4">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {lines.map((line, i) => (
            <path key={i} d={line.path} stroke={line.color} strokeWidth={line.width || 2} fill="none" strokeLinejoin="round" />
          ))}
        </svg>

        {/* KOLOM 1: PENYISIHAN (18 TIM) */}
        <div className="flex flex-col justify-between h-full py-4">
          <div className="text-[10px] font-bold text-gray-600 text-center mb-2 tracking-widest uppercase">Penyisihan</div>
          {BRACKET_DATA.daftarTim.map((nama, i) => (
            <div key={i} ref={el => setRef(`T${i}`, el)} className="bg-[#0d1117] border border-gray-800 w-44 h-9 flex items-center px-3 rounded-sm z-10 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-blue-900/30 flex items-center justify-center text-[9px] font-bold text-blue-400 mr-2 border border-blue-500/20">
                {i+1}
              </div>
              <span className="text-[10px] font-bold truncate tracking-wide">{nama}</span>
            </div>
          ))}
        </div>

        {/* KOLOM 2: MATCHES (M1-M9) */}
        <div className="flex flex-col justify-around h-full py-2">
          <div className="text-[10px] font-bold text-blue-500 text-center tracking-widest uppercase">QUALIFICATION</div>
          {BRACKET_DATA.matchLabels.map((label, i) => (
            <div key={i} ref={el => setRef(`M${i}`, el)} className="bg-[#0d1117] border border-blue-900/40 w-32 h-12 flex items-center justify-center rounded-sm z-10 shadow-lg group">
              <span className="text-[11px] font-black text-blue-400 italic">{label}</span>
            </div>
          ))}
        </div>

        {/* KOLOM 3: QUARTER FINALS (QF1-QF4) */}
        <div className="flex flex-col justify-around h-full py-10">
          <div className="text-[10px] font-bold text-purple-500 text-center tracking-widest uppercase">SEMI FINAL</div>
          {BRACKET_DATA.qfLabels.map((label, i) => (
            <div key={i} ref={el => setRef(`QF${i}`, el)} className="bg-[#0d1117] border border-purple-900/40 w-32 h-12 flex items-center justify-center rounded-sm z-10 shadow-lg">
              <span className="text-[11px] font-black text-purple-400 italic">{label}</span>
            </div>
          ))}
        </div>

        {/* KOLOM 4: SEMI FINALS */}
        <div className="flex flex-col justify-around h-full py-32">
          <div className="text-[10px] font-bold text-pink-500 text-center tracking-widest uppercase">FINAL</div>
          {BRACKET_DATA.sfLabels.map((label, i) => (
            <div key={i} ref={el => setRef(`SF${i}`, el)} className="bg-[#0d1117] border border-pink-900/40 w-36 h-14 flex items-center justify-center rounded-sm z-10 shadow-xl text-center px-2">
              <span className="text-[10px] font-black text-pink-400 italic uppercase leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* KOLOM 5: GRAND FINAL */}
        <div className="flex flex-col justify-center h-full">
          <div className="text-[10px] font-bold text-white/40 text-center mb-4 tracking-widest uppercase">WINNER</div>
          <div ref={el => setRef(`FINAL`, el)} className="bg-gradient-to-br from-pink-800 to-red-900 border-2 border-white/20 w-40 h-16 flex items-center justify-center rounded-sm z-10 shadow-2xl hover:scale-105 transition-transform">
            <span className="text-sm font-black text-white italic tracking-widest uppercase">{BRACKET_DATA.finalLabel}</span>
          </div>
        </div>

        {/* KOLOM 6: CHAMPION */}
        <div className="flex flex-col justify-center h-full">
          <div ref={el => setRef(`JUARA`, el)} className="relative z-10">
            <div className="absolute -inset-2 bg-yellow-500/10 blur-xl rounded-full"></div>
            <div className="relative bg-[#0d1117] border-2 border-yellow-500 p-8 rounded-lg flex flex-col items-center w-52 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
              <Trophy className="text-yellow-500 mb-4 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" size={60} />
              <div className="text-[10px] font-black text-yellow-500 tracking-[0.4em] mb-4 uppercase">{BRACKET_DATA.juaraLabel}</div>
              <div className="h-[1px] w-full bg-yellow-500/20 mb-4"></div>
              <div className="text-sm font-black text-white uppercase text-center leading-tight tracking-widest">{BRACKET_DATA.namaJuara}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;

