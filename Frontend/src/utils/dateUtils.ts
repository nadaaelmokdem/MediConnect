/* eslint-disable @typescript-eslint/no-explicit-any */
export const getTodayStr = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const checkIsToday = (day: number, month: number, year: number): boolean => {
  const today = new Date();
  return (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  );
};

export const filterEventsForDay = (
  day: number,
  month: number,
  year: number,
  schedule: any[]
): any[] => {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return schedule.filter((item) => item.date === dateStr);
};

export const parseTime = (timeStr: string): number => {
  const [time, modifier] = timeStr.split(' ');
  const [hours, minutes] = time.split(':');
  let adjustedHours = hours;
  if (adjustedHours === '12') adjustedHours = '00';
  if (modifier === 'PM') adjustedHours = String(parseInt(adjustedHours, 10) + 12);
  return parseInt(adjustedHours, 10) * 60 + parseInt(minutes, 10);
};

export const sortSchedule = (schedule: any[]): any[] => {
  return [...schedule].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return parseTime(a.time) - parseTime(b.time);
  });
};
