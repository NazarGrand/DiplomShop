export const categoryNamesMap: Record<string, string> = {
  smartphones: "Смартфони",
  computers: "Комп'ютери",
  tablets: "Планшети",
  "smart-watches": "Розумні годинники",
  headphone: "Навушники",
  laptops: "Ноутбуки",
  gaming: "Геймінг",
  televisions: "Телевізори",
};

export const getCategoryName = (categoryKey: string | undefined): string => {
  if (!categoryKey) return "";
  return categoryNamesMap[categoryKey] || categoryKey;
};

