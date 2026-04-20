/**
 * Utility to handle exercise recurrence and duration logic
 */

const dayMap: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat"
};

export interface RecurrenceRules {
  date: string;       // Start Date (YYYY-MM-DD)
  endDate?: string;   // End Date (YYYY-MM-DD)
  repeats: string[];  // e.g. ["Mon", "Wed"]
}

/**
 * Determines if an exercise is active on a specific Date
 */
export function isExerciseActiveOnDate(rules: RecurrenceRules, checkDate: Date): boolean {
  const startDate = new Date(rules.date + "T00:00:00");
  const endDate = rules.endDate ? new Date(rules.endDate + "T23:59:59") : startDate;
  
  // Set time to midnight for comparison
  const check = new Date(checkDate);
  check.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  // 1. Check date range
  if (check < start || check > end) {
    return false;
  }

  // 2. If no repeats, only show on start date
  if (!rules.repeats || rules.repeats.length === 0) {
    return check.getTime() === start.getTime();
  }

  // 3. Handle "Daily" shortcut if it's there
  if (rules.repeats.includes("Daily")) {
    return true;
  }

  // 4. Check day of week
  const dayName = dayMap[check.getDay()];
  return rules.repeats.includes(dayName);
}
