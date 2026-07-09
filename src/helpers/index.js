export const formatCurrency = (val) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val || 0);

export const getFirstName = (user) => user.name.split(' ')[0];

export const getRecipeName = (recipes, id) =>
  recipes.find((r) => r.id === id)?.title || 'Not planned';

export const getCategoryById = (categories, id) =>
  categories.find((c) => c.id == id);

export const getAccountName = (accounts, id) =>
  accounts.find((a) => a.id == id)?.name || 'Unknown';

export const getTodayAbbr = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'short' });

export const formatMonthYear = (date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export const filterExpensesByMonth = (expenses, viewDate) =>
  expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getCurrentMonthExpenses = (expenses) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
};

export const computeCategoryTotals = (categories, filteredExpenses) => {
  const totalSpend = filteredExpenses.reduce(
    (sum, exp) => sum + (Number(exp.amount) || 0),
    0
  );

  return categories
    .map((cat) => {
      const total = filteredExpenses
        .filter((e) => e.categoryId == cat.id)
        .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
      const percentage = totalSpend > 0 ? (total / totalSpend) * 100 : 0;
      return { ...cat, total, percentage };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
};

export const computeUserTotals = (filteredExpenses) => {
  const totalSpend = filteredExpenses.reduce(
    (sum, exp) => sum + (Number(exp.amount) || 0),
    0
  );

  const userMap = {};
  filteredExpenses.forEach((exp) => {
    const owner = exp.owner || 'Unknown';
    const amount = Number(exp.amount) || 0;
    if (!userMap[owner]) userMap[owner] = 0;
    userMap[owner] += amount;
  });

  return Object.keys(userMap)
    .map((owner) => {
      const total = userMap[owner];
      const percentage = totalSpend > 0 ? (total / totalSpend) * 100 : 0;
      return { id: owner, name: owner, total, percentage };
    })
    .sort((a, b) => b.total - a.total);
};

export const getCoordinatesForPercent = (percent, cx, cy, radius) => {
  const angle = percent * 2 * Math.PI - Math.PI / 2;
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);
  return [x, y];
};
