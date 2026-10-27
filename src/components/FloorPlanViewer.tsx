import React, { useState } from 'react';
import { LayoutGrid, Maximize2, ShieldAlert } from 'lucide-react';

interface FloorPlanProps {
  initialBhk?: number;
  initialSqft?: number;
}

export const FloorPlanViewer: React.FC<FloorPlanProps> = ({ initialBhk = 3, initialSqft = 1500 }) => {
  const [bhk, setBhk] = useState<number>(initialBhk);
  const [sqft, setSqft] = useState<number>(initialSqft);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  // Room dimension breakdown proportions based on typical Bengaluru residential layouts
  const roomLayouts: Record<number, {
    title: string;
    rooms: Array<{
      id: string;
      name: string;
      dimensions: string;
      areaPercent: number;
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
    }>;
  }> = {
    1: {
      title: '1 BHK Compact Suite Layout',
      rooms: [
        { id: 'living', name: 'Living & Dining Hall', dimensions: "12'0\" x 16'0\"", areaPercent: 42, x: 20, y: 20, w: 260, h: 200, color: 'fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-600' },
        { id: 'master', name: 'Master Bedroom', dimensions: "11'0\" x 12'6\"", areaPercent: 32, x: 300, y: 20, w: 220, h: 180, color: 'fill-blue-50 dark:fill-blue-950/30 stroke-blue-600' },
        { id: 'kitchen', name: 'Kitchen & Utility', dimensions: "8'0\" x 9'6\"", areaPercent: 16, x: 20, y: 240, w: 180, h: 120, color: 'fill-amber-50 dark:fill-amber-950/30 stroke-amber-600' },
        { id: 'bath', name: 'Bathroom', dimensions: "5'0\" x 7'6\"", areaPercent: 10, x: 220, y: 240, w: 120, h: 120, color: 'fill-purple-50 dark:fill-purple-950/30 stroke-purple-600' }
      ]
    },
    2: {
      title: '2 BHK Classic Urban Layout',
      rooms: [
        { id: 'living', name: 'Living & Dining Hall', dimensions: "13'6\" x 19'0\"", areaPercent: 38, x: 20, y: 20, w: 280, h: 190, color: 'fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-600' },
        { id: 'master', name: 'Master Bedroom', dimensions: "12'0\" x 14'0\"", areaPercent: 24, x: 320, y: 20, w: 220, h: 180, color: 'fill-blue-50 dark:fill-blue-950/30 stroke-blue-600' },
        { id: 'bed2', name: 'Guest / Child Bedroom', dimensions: "11'0\" x 12'0\"", areaPercent: 18, x: 320, y: 220, w: 220, h: 150, color: 'fill-indigo-50 dark:fill-indigo-950/30 stroke-indigo-600' },
        { id: 'kitchen', name: 'Kitchen', dimensions: "9'0\" x 10'0\"", areaPercent: 12, x: 20, y: 230, w: 160, h: 140, color: 'fill-amber-50 dark:fill-amber-950/30 stroke-amber-600' },
        { id: 'bath1', name: 'Master Bath', dimensions: "5'6\" x 8'0\"", areaPercent: 8, x: 200, y: 230, w: 100, h: 140, color: 'fill-purple-50 dark:fill-purple-950/30 stroke-purple-600' }
      ]
    },
    3: {
      title: '3 BHK Contemporary Residence Layout',
      rooms: [
        { id: 'living', name: 'Formal Living & Dining Room', dimensions: "15'0\" x 22'6\"", areaPercent: 34, x: 20, y: 20, w: 300, h: 190, color: 'fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-600' },
        { id: 'master', name: 'Master Bedroom (Attached Bath)', dimensions: "13'0\" x 15'0\"", areaPercent: 22, x: 340, y: 20, w: 220, h: 180, color: 'fill-blue-50 dark:fill-blue-950/30 stroke-blue-600' },
        { id: 'bed2', name: 'Bedroom 2', dimensions: "12'0\" x 13'6\"", areaPercent: 17, x: 340, y: 220, w: 220, h: 160, color: 'fill-indigo-50 dark:fill-indigo-950/30 stroke-indigo-600' },
        { id: 'bed3', name: 'Bedroom 3 / Study', dimensions: "11'0\" x 12'0\"", areaPercent: 13, x: 20, y: 230, w: 160, h: 150, color: 'fill-teal-50 dark:fill-teal-950/30 stroke-teal-600' },
        { id: 'kitchen', name: 'Modular Kitchen & Utility', dimensions: "10'0\" x 11'0\"", areaPercent: 9, x: 200, y: 230, w: 120, h: 150, color: 'fill-amber-50 dark:fill-amber-950/30 stroke-amber-600' },
        { id: 'balcony', name: 'Viewing Balcony Deck', dimensions: "6'0\" x 14'0\"", areaPercent: 5, x: 20, y: 395, w: 300, h: 50, color: 'fill-rose-50 dark:fill-rose-950/30 stroke-rose-600' }
      ]
    },
    4: {
      title: '4 BHK Luxury Villa Layout',
      rooms: [
        { id: 'living', name: 'Grand Living & Dining Pavilion', dimensions: "18'0\" x 26'0\"", areaPercent: 32, x: 20, y: 20, w: 310, h: 200, color: 'fill-emerald-50 dark:fill-emerald-950/30 stroke-emerald-600' },
        { id: 'master', name: 'Master Suite + Walk-in Wardrobe', dimensions: "14'6\" x 17'0\"", areaPercent: 22, x: 350, y: 20, w: 210, h: 190, color: 'fill-blue-50 dark:fill-blue-950/30 stroke-blue-600' },
        { id: 'bed2', name: 'En-Suite Bedroom 2', dimensions: "13'0\" x 14'0\"", areaPercent: 16, x: 350, y: 230, w: 210, h: 150, color: 'fill-indigo-50 dark:fill-indigo-950/30 stroke-indigo-600' },
        { id: 'bed3', name: 'Bedroom 3', dimensions: "12'0\" x 13'0\"", areaPercent: 13, x: 20, y: 240, w: 150, h: 140, color: 'fill-teal-50 dark:fill-teal-950/30 stroke-teal-600' },
        { id: 'bed4', name: 'Home Office / Guest Bed', dimensions: "11'0\" x 12'0\"", areaPercent: 10, x: 190, y: 240, w: 140, h: 140, color: 'fill-cyan-50 dark:fill-cyan-950/30 stroke-cyan-600' },
        { id: 'kitchen', name: 'Gourmet Kitchen', dimensions: "11'0\" x 13'0\"", areaPercent: 7, x: 20, y: 400, w: 240, h: 70, color: 'fill-amber-50 dark:fill-amber-950/30 stroke-amber-600' }
      ]
    }
  };

  const currentLayout = roomLayouts[bhk] || roomLayouts[3];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Interactive 2D Schematic Floor Plan
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Illustrative architectural room layout. Click any room zone to view proportional carpet area and standard Bangalore dimensions.
          </p>
        </div>

        {/* BHK Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setBhk(num)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                bhk === num
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {num} BHK
            </button>
          ))}
        </div>
      </div>

      {/* SVG Floor Plan Canvas */}
      <div className="relative border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-950 p-4 overflow-hidden">
        <svg
          viewBox="0 0 580 480"
          className="w-full h-auto max-h-[440px] mx-auto select-none"
        >
          {/* Outer Boundary Wall */}
          <rect
            x="10"
            y="10"
            width="560"
            height="460"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="4"
            rx="6"
          />

          {/* Rooms */}
          {currentLayout.rooms.map((room) => {
            const isHovered = activeRoom === room.id;
            const approxRoomSqft = Math.round((sqft * room.areaPercent) / 100);

            return (
              <g
                key={room.id}
                onMouseEnter={() => setActiveRoom(room.id)}
                onMouseLeave={() => setActiveRoom(null)}
                className="cursor-pointer transition-all"
              >
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.w}
                  height={room.h}
                  className={`${room.color} transition-all ${
                    isHovered ? 'stroke-[3px] opacity-100' : 'stroke-[1.5px] opacity-80'
                  }`}
                  rx="4"
                />

                {/* Room Label */}
                <text
                  x={room.x + room.w / 2}
                  y={room.y + room.h / 2 - 8}
                  textAnchor="middle"
                  className="text-[12px] font-bold fill-slate-800 dark:fill-slate-100 pointer-events-none"
                >
                  {room.name}
                </text>

                {/* Dimensions */}
                <text
                  x={room.x + room.w / 2}
                  y={room.y + room.h / 2 + 10}
                  textAnchor="middle"
                  className="text-[10px] font-mono fill-slate-500 dark:fill-slate-400 pointer-events-none"
                >
                  {room.dimensions} · ~{approxRoomSqft} sq.ft
                </text>
              </g>
            );
          })}
        </svg>

        {/* Informational overlay notice */}
        <div className="mt-3 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong>Architectural Notice:</strong> This schematic floor plan is an illustrative 2D layout representation. Actual physical room orientations, structural load-bearing columns, and balcony setbacks vary by specific builder society.
          </span>
        </div>
      </div>
    </div>
  );
};
