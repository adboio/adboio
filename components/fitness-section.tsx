'use client'

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { macroTargets, recipes } from "@/data/fitness";
import Link from "next/link";

interface WeightEntry {
  date: string;
  weight: number;
}

interface FoodEntry {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
}

export function FitnessSection() {
  const [weightData, setWeightData] = useState<WeightEntry[]>([]);
  const [foodData, setFoodData] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(true);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);

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
            weight: row.weight_value,
          }))
        );
      }
      setLoading(false);
    }
    fetchWeight();
  }, []);

  useEffect(() => {
    async function fetchFood() {
      setFoodLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("food")
        .select("date, calories, protein, carbs, fat, description")
        .order("date", { ascending: true });
      if (!error && data) {
        setFoodData(
          data.map((row) => ({
            date: row.date,
            calories: row.calories ?? 0,
            protein: row.protein ?? 0,
            carbs: row.carbs ?? 0,
            fat: row.fat ?? 0,
            description: row.description,
          }))
        );
      }
      setFoodLoading(false);
    }
    fetchFood();
  }, []);

  const sortedFood = [...foodData].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latestEntry = sortedFood.find((f) => f.calories && f.calories !== 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold mb-2 uppercase tracking-wider">
          Fitness Data
        </h2>
        <p className="text-sm text-muted-foreground">
          [open source fitness tracking.{" "}
          <a href="https://www.adboio.fit/log" target="_blank" className="underline hover:no-underline">
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
            <div className="text-center text-sm text-muted-foreground py-8">Loading...</div>
          ) : (
            <div className="w-full aspect-[2/1]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <XAxis
                    dataKey="date"
                    tick={false}
                    stroke="currentColor"
                  />
                  <YAxis
                    tick={{ fontSize: 11, fontFamily: 'monospace' }}
                    domain={[190, 270]}
                    stroke="currentColor"
                    ticks={[190, 210, 230, 250, 270]}
                  />
                  <Tooltip
                    contentStyle={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      border: '1px solid currentColor',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <ReferenceLine
                    y={225}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    label={{
                      value: 'target',
                      position: 'insideBottomLeft',
                      fill: 'currentColor',
                      fontSize: 11,
                      fontFamily: 'monospace',
                      dy: -5
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    dot={{ fill: 'currentColor', r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Latest Macros */}
        <div className="border border-border p-4 pb-2">
          <h3 className="text-sm font-bold mb-4">
            latest macros {latestEntry && `(${latestEntry.date})`}
          </h3>
          {foodLoading ? (
            <div className="text-center text-sm text-muted-foreground py-8">Loading...</div>
          ) : latestEntry ? (
            <div className="space-y-3 font-mono text-sm">
              <MacroBar
                label="calories"
                value={latestEntry.calories}
                target={macroTargets.calories}
              />
              <MacroBar
                label="protein"
                value={latestEntry.protein}
                target={macroTargets.protein}
              />
              <MacroBar
                label="carbs"
                value={latestEntry.carbs}
                target={macroTargets.carbs}
              />
              <MacroBar
                label="fat"
                value={latestEntry.fat}
                target={macroTargets.fat}
              />
              {latestEntry.description && (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setShowDescriptionPopup(true)}
                    className="text-xs text-muted-foreground hover:text-foreground underline hover:no-underline transition-colors"
                  >
                    what i ate
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground py-8">No entries found</div>
          )}

          {/* Description Popup */}
          {showDescriptionPopup && latestEntry?.description && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDescriptionPopup(false)}
            >
              <div
                className="bg-background border border-border p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-bold">
                    what i ate ({latestEntry.date})
                  </h4>
                  <button
                    onClick={() => setShowDescriptionPopup(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-sm whitespace-pre-wrap font-mono">
                  {latestEntry.description}
                </div>
              </div>
            </div>
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

function MacroBar({ label, value, target }: { label: string; value: number; target: number }) {
  const percentage = Math.min((value / target) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {value}/{target}
        </span>
      </div>
      <div className="w-full h-2 border border-border">
        <div
          className="h-full bg-foreground transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
