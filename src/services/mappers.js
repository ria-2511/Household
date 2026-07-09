export const mapProfile = (row) => ({
  id: row.id,
  name: row.display_name,
  color: row.color,
});

export const mapTask = (row) => ({
  id: row.id,
  title: row.title,
  desc: row.description,
  owner: row.owner,
  done: row.done,
  completedBy: row.completed_by,
});

export const mapGrocery = (row) => ({
  id: row.id,
  name: row.name,
  qtyStr: row.qty_str,
  note: row.note,
  owner: row.owner,
  done: row.done,
  completedBy: row.completed_by,
});

export const mapRecipe = (row) => ({
  id: row.id,
  title: row.title,
  ingredients: row.ingredients || [],
  steps: row.steps,
  tags: row.tags || [],
  note: row.note,
  owner: row.owner,
});

export const mapExpense = (row) => ({
  id: row.id,
  amount: Number(row.amount),
  categoryId: row.category_id,
  accountId: row.account_id,
  date: row.expense_date,
  note: row.note,
  owner: row.owner,
});

export const mapCategory = (row) => ({
  id: row.id,
  name: row.name,
  icon: row.icon,
});

export const mapAccount = (row) => ({
  id: row.id,
  name: row.name,
  active: row.active,
});

export const mapMenuPlans = (rows) => {
  const plan = {};
  rows.forEach((row) => {
    if (!plan[row.day_abbr]) plan[row.day_abbr] = {};
    plan[row.day_abbr][row.meal] = row.recipe_id;
  });
  return plan;
};

export const mapMember = (row, profile) => ({
  userId: row.user_id,
  role: row.role,
  joinedAt: row.joined_at,
  name: profile?.display_name || 'Member',
  color: profile?.color || '#6E8E75',
});

export const taskToDb = (task, householdId, userId, ownerName) => ({
  household_id: householdId,
  title: task.title,
  description: task.desc || '',
  owner: task.owner || ownerName,
  created_by_user_id: userId,
  done: task.done || false,
  completed_by: task.completedBy || null,
});

export const groceryToDb = (item, householdId, userId, ownerName) => ({
  household_id: householdId,
  name: item.name,
  qty_str: item.qtyStr || '1',
  note: item.note || '',
  owner: item.owner || ownerName,
  created_by_user_id: userId,
  done: item.done || false,
  completed_by: item.completedBy || null,
});

export const recipeToDb = (recipe, householdId, userId, ownerName) => ({
  household_id: householdId,
  title: recipe.title,
  ingredients: recipe.ingredients || [],
  steps: recipe.steps || '',
  tags: recipe.tags || [],
  note: recipe.note || '',
  owner: recipe.owner || ownerName,
  created_by_user_id: userId,
});

export const expenseToDb = (expense, householdId, userId, ownerName) => ({
  household_id: householdId,
  amount: expense.amount,
  category_id: expense.categoryId,
  account_id: expense.accountId,
  expense_date: expense.date,
  note: expense.note || '',
  owner: expense.owner || ownerName,
  created_by_user_id: userId,
});
