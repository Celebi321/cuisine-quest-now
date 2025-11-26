import { useState, useEffect } from "react";

const HISTORY_KEY = "homNayAnGi_history";

export interface MealRecord {
  dishId: string;
  dishTitle: string;
  timestamp: number;
}

export const useMealHistory = () => {
  const [history, setHistory] = useState<MealRecord[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addToHistory = (dishId: string, dishTitle: string) => {
    const newRecord: MealRecord = {
      dishId,
      dishTitle,
      timestamp: Date.now(),
    };
    
    setHistory((prev) => {
      const newHistory = [newRecord, ...prev].slice(0, 50); // Keep last 50
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  const getLastEatenDate = (dishId: string): number | null => {
    const record = history.find((r) => r.dishId === dishId);
    return record ? record.timestamp : null;
  };

  return { history, addToHistory, clearHistory, getLastEatenDate };
};
