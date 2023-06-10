const getDates = (
  startDate: string | Date,
  endDate: string | Date,
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  // Iterate over the dates starting from the start date until reaching the end date
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const formattedDate = date.toISOString().split('T')[0];
    dates.push(formattedDate);
  }

  return dates;
};

const getDatesWithCondition = (
  startDate: string | Date,
  endDate: string | Date,
  excludedDates?: string[],
): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: string[] = [];

  // Iterate over the dates starting from the start date until reaching the end date
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay();
    const formattedDate = date.toISOString().split('T')[0];

    // Skip Saturdays (dayOfWeek = 6), Sundays (dayOfWeek = 0), and excluded dates
    if (
      dayOfWeek !== 6 &&
      dayOfWeek !== 0 &&
      !excludedDates?.includes(formattedDate)
    ) {
      dates.push(formattedDate);
    }
  }

  return dates;
};

export const dateTimeUtils = {
  getDates,
  getDatesWithCondition,
};

export const isWeekend = (date: Date): boolean => {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 6 || dayOfWeek === 0;
};
