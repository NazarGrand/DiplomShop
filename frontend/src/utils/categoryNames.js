export const categoryNamesMap = {
  smartphones: "Смартфони",
  computers: "Комп'ютери",
  tablets: "Планшети",
  "smart-watches": "Розумні годинники",
  headphone: "Навушники",
  laptops: "Ноутбуки",
  gaming: "Геймінг",
  televisions: "Телевізори",
};

export const getCategoryName = (categoryKey) => {
  if (!categoryKey) return "";
  return categoryNamesMap[categoryKey] || categoryKey;
};
