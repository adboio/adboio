"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { recipes } from "@/data/fitness";
import Link from "next/link";

interface WeightEntry {
  date: string;
  timestamp: number;
  weight: number;
}

interface WorkoutEntry {
  date: string;
  type: "lift" | "climb" | null;
  duration: number | null;
  title: string | null;
  description: string | null;
}

export function FitnessSection() {
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [workoutData, setWorkoutData] = useState<WorkoutEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [workoutLoading, setWorkoutLoading] = useState(true);

  useEffect(() => {
    async function fetchWeight() {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("weight")
        .select("date, weight_value")
        .order("date", { ascending: true });
      if (!error && data) {
        setWeightData(
          data.map((row) => ({
            date: row.date,
            timestamp: new Date(row.date).getTime(),
            weight: row.weight_value,
          })),
        );
      }
      setLoading(false);
    }
    fetchWeight();
  }, []);

  useEffect(() => {
    async function fetchWorkouts() {
      setWorkoutLoading(true);
      const supabase = createClient();
      // Fetch last 6 months of workouts
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const { data, error } = await supabase
        .from("workouts")
        .select("date, type, duration, title, description")
        .gte("date", sixMonthsAgo.toISOString().split("T")[0])
        .order("date", { ascending: true });
      if (!error && data) {
        setWorkoutData(
          data.map((row) => ({
            date: row.date ?? "",
            type: row.type,
            duration: row.duration,
            title: row.title,
            description: row.description,
          })),
        );
      }
      setWorkoutLoading(false);
    }
    fetchWorkouts();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-2 uppercase tracking-wider">
          Fitness Data
        </h2>
        <p className="text-sm text-muted-foreground">
          [open source fitness tracking.{" "}
          <a
            href="https://www.adboio.fit/log"
            target="_blank"
            className="underline hover:no-underline"
          >
            see more here]
          </a>
        </p>
      </div>

      {/* Weight Chart & Macros Grid */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-6">
        {/* Weight Chart */}
        <div className="border border-border p-4 pb-2">
          <h3 className="text-sm font-bold mb-4">weight progress</h3>
          {loading ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Loading...
            </div>
          ) : (
            <div className="w-full aspect-[2/1]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    tick={false}
                    stroke="currentColor"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: "monospace" }}
                    domain={[190, 270]}
                    stroke="currentColor"
                    ticks={[190, 210, 230, 250, 270]}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: "monospace",
                      fontSize: "11px",
                      border: "1px solid currentColor",
                      backgroundColor: "#ffffff",
                    }}
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString();
                    }}
                  />
                  <ReferenceLine
                    y={225}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    label={{
                      value: "target",
                      position: "insideBottomLeft",
                      fill: "currentColor",
                      fontSize: 11,
                      fontFamily: "monospace",
                      dy: -5,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    dot={{ fill: "currentColor", r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Workout Activity */}
        <div className="border border-border p-4 pb-2">
          <h3 className="text-sm font-bold mb-4">workout activity</h3>
          {workoutLoading ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Loading...
            </div>
          ) : (
            <WorkoutChart workouts={workoutData} />
          )}
        </div>
      </div>

      {/* Recipes */}
      <div>
        <h3 className="text-sm font-bold mb-4 uppercase tracking-wider">
          My High-Protein Recipes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.name}
              href={recipe.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-border hover:border-foreground transition-colors p-3 text-center"
            >
              {recipe.emoji && (
                <div className="text-2xl mb-2">{recipe.emoji}</div>
              )}
              <div className="text-xs leading-tight">{recipe.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkoutChart({ workouts }: { workouts: WorkoutEntry[] }) {
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    workouts: WorkoutEntry[];
    x: number;
    y: number;
  } | null>(null);
  const [selectedDay, setSelectedDay] = useState<{
    date: string;
    workouts: WorkoutEntry[];
  } | null>(null);

  // Build a map of dates to workouts
  const workoutsByDate = new Map<string, WorkoutEntry[]>();
  workouts.forEach((w) => {
    if (w.date) {
      const existing = workoutsByDate.get(w.date) || [];
      existing.push(w);
      workoutsByDate.set(w.date, existing);
    }
  });

  // Generate last 26 weeks of dates (6 months)
  const weeks: string[][] = [];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday

  // Start from the beginning of the current week going back 26 weeks
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - dayOfWeek - 25 * 7);

  for (let week = 0; week < 26; week++) {
    const weekDates: string[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + week * 7 + day);
      weekDates.push(date.toISOString().split("T")[0]);
    }
    weeks.push(weekDates);
  }

  // Check if there's a workout on a given date
  const hasWorkout = (date: string): boolean => {
    const dayWorkouts = workoutsByDate.get(date);
    return !!dayWorkouts && dayWorkouts.length > 0;
  };

  const handleMouseEnter = (
    date: string,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const dayWorkouts = workoutsByDate.get(date) || [];
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredDay({
      date,
      workouts: dayWorkouts,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const handleClick = (date: string) => {
    const dayWorkouts = workoutsByDate.get(date) || [];
    if (dayWorkouts.length > 0) {
      setSelectedDay({ date, workouts: dayWorkouts });
    }
  };

  const monthLabels = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  // Find which weeks start a new month
  const monthStarts: { week: number; month: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = new Date(week[0]);
    const month = firstDayOfWeek.getMonth();
    if (month !== lastMonth) {
      monthStarts.push({ week: weekIndex, month });
      lastMonth = month;
    }
  });

  // Count total workouts
  const totalWorkouts = workouts.length;

  return (
    <div className="space-y-2">
      {/* Month labels */}
      <div className="flex text-[10px] text-muted-foreground">
        {monthStarts.map(({ week, month }, i) => {
          const nextStart = monthStarts[i + 1]?.week ?? 26;
          const width = ((nextStart - week) / 26) * 100;
          return (
            <div
              key={`${month}-${week}`}
              style={{ width: `${width}%` }}
              className="text-left"
            >
              {monthLabels[month]}
            </div>
          );
        })}
      </div>

      {/* Chart grid */}
      <div className="flex gap-[2px]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[2px] flex-1">
            {week.map((date) => {
              const worked = hasWorkout(date);
              const isFuture = new Date(date) > today;

              return (
                <div
                  key={date}
                  className={`aspect-square w-full border transition-colors ${
                    isFuture
                      ? "border-border/30 bg-transparent"
                      : worked
                        ? "border-background bg-foreground cursor-pointer"
                        : "border-border bg-transparent"
                  }`}
                  onMouseEnter={(e) => !isFuture && handleMouseEnter(date, e)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => !isFuture && worked && handleClick(date)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="text-[10px] text-muted-foreground pt-1">
        <span>{totalWorkouts} workouts in last 6 months</span>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: hoveredDay.x,
            top: hoveredDay.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-background border border-border px-2 py-1 text-xs whitespace-nowrap">
            <div className="font-bold">{hoveredDay.date}</div>
            {hoveredDay.workouts.length === 0 ? (
              <div className="text-muted-foreground">no workout</div>
            ) : (
              hoveredDay.workouts.map((w, i) => (
                <div key={i}>
                  {w.title || w.type || "workout"}
                  {w.duration && ` (${w.duration}min)`}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Workout Details Popup */}
      {selectedDay && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDay(null)}
        >
          <div
            className="bg-background border border-border p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedDay(null)}
              className="text-muted-foreground hover:text-foreground p-1"
              style={{ position: "absolute", top: "8px", right: "8px" }}
            >
              ✕
            </button>
            <div className="space-y-4">
              {selectedDay.workouts.map((w, i) => (
                <div key={i} className="text-sm font-mono">
                  <div className="font-bold">
                    {w.title || w.type || "workout"}
                    {w.duration && (
                      <span className="font-normal text-muted-foreground ml-2">
                        ({w.duration} min)
                      </span>
                    )}
                  </div>
                  {w.description && (
                    <div className="mt-1 whitespace-pre-wrap text-muted-foreground">
                      {w.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
