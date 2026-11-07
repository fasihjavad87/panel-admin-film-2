export const SchedulePatternOptions = [
  { id: "weekly", title: "هفتگی (تک‌روزه)", description: "مثلاً فقط شنبه‌ها" },
  { id: "multi_weekly", title: "هفتگی (چندروزه)", description: "مثلاً شنبه و یکشنبه" },
  { id: "daily", title: "روزانه", description: "هر روز یک قسمت" },
  { id: "binge", title: "یک‌جا (Binge)", description: "همه قسمت‌ها یک روز" },
  { id: "custom", title: "دستی", description: "تاریخ‌ها را خودت وارد کن" },
];

export const WeekDayOptions = [
  { id: 0, title: "یکشنبه" },
  { id: 1, title: "دوشنبه" },
  { id: 2, title: "سه‌شنبه" },
  { id: 3, title: "چهارشنبه" },
  { id: 4, title: "پنجشنبه" },
  { id: 5, title: "جمعه" },
  { id: 6, title: "شنبه" },
];

export const getSchedulePatternText = (value) => {
  return SchedulePatternOptions.find((o) => o.id === value)?.title || "نامشخص";
};