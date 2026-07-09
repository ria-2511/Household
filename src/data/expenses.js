const todayISO = new Date().toISOString();

export const expenses = [
  { id: 1, amount: 4500, categoryId: 2, accountId: 1, date: todayISO, note: 'Weekly groceries from D-Mart', owner: 'Sarah' },
  { id: 2, amount: 1800, categoryId: 4, accountId: 1, date: todayISO, note: 'Dinner at Haldirams', owner: 'Mike' },
  { id: 3, amount: 1200, categoryId: 3, accountId: 2, date: todayISO, note: 'Petrol', owner: 'Sarah' },
];
