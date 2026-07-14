import { supabase } from './supabaseClient';
import {
  mapProfile,
  mapTask,
  mapGrocery,
  mapRecipe,
  mapExpense,
  mapCategory,
  mapAccount,
  mapMenuPlans,
  mapMember,
  taskToDb,
  groceryToDb,
  recipeToDb,
  expenseToDb,
} from './mappers';

const getClient = () => {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local');
  return supabase;
};

export const fetchProfile = async (userId) => {
  const { data, error } = await getClient()
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return mapProfile(data);
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await getClient()
    .from('profiles')
    .update({
      display_name: updates.name,
      color: updates.color,
    })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return mapProfile(data);
};

export const fetchHouseholdContext = async (userId) => {
  const client = getClient();
  const { data: membership, error: memberError } = await client
    .from('household_members')
    .select('household_id, role, joined_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (memberError) throw memberError;
  if (!membership) return { needsJoin: true, household: null, members: [], joinCode: null };

  const { data: household, error: householdError } = await client
    .from('households')
    .select('*')
    .eq('id', membership.household_id)
    .single();

  if (householdError) throw householdError;

  const { data: membersData, error: membersError } = await client
    .from('household_members')
    .select('user_id, role, joined_at')
    .eq('household_id', membership.household_id);

  if (membersError) throw membersError;

  const userIds = membersData.map((m) => m.user_id);
  const { data: profiles, error: profilesError } = await client
    .from('profiles')
    .select('*')
    .in('id', userIds);

  if (profilesError) throw profilesError;

  const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));

  return {
    needsJoin: false,
    household: {
      id: household.id,
      name: household.name,
      ownerId: household.owner_id,
      joinCode: household.join_code,
      role: membership.role,
    },
    joinCode: household.join_code,
    members: membersData.map((m) => mapMember(m, profileMap[m.user_id])),
  };
};

export const previewHouseholdByCode = async (code) => {
  const { data, error } = await getClient().rpc('preview_household_by_code', { p_code: code });
  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Invalid join code');
  return data[0];
};

export const joinHouseholdByCode = async (code) => {
  const { data, error } = await getClient().rpc('join_household_by_code', { p_code: code });
  if (error) throw error;
  return data[0];
};

export const regenerateJoinCode = async (householdId) => {
  const { data, error } = await getClient().rpc('regenerate_join_code', { p_household_id: householdId });
  if (error) throw error;
  return data;
};

export const removeHouseholdMember = async (householdId, userId) => {
  const { error } = await getClient().rpc('remove_household_member', {
    p_household_id: householdId,
    p_user_id: userId,
  });
  if (error) throw error;
};

export const updateHouseholdName = async (householdId, name) => {
  const { data, error } = await getClient()
    .from('households')
    .update({ name })
    .eq('id', householdId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const createHouseholdRemote = async (userId) => {
  const client = getClient();
  const { data: profile } = await client.from('profiles').select('display_name').eq('id', userId).single();
  const householdName = `${profile?.display_name || 'My'}'s Household`;
  
  const joinCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  const { data: newHousehold, error: hError } = await client
    .from('households')
    .insert({ name: householdName, owner_id: userId, join_code: joinCode })
    .select()
    .single();
  if (hError) throw hError;

  const { error: mError } = await client
    .from('household_members')
    .insert({ household_id: newHousehold.id, user_id: userId, role: 'owner' });
  if (mError) throw mError;

  await client.from('household_settings').insert({ household_id: newHousehold.id });
  await client.from('categories').insert([
    { household_id: newHousehold.id, name: 'Rent/Mortgage', icon: '🏠' },
    { household_id: newHousehold.id, name: 'Groceries', icon: '🛒' },
    { household_id: newHousehold.id, name: 'Transport', icon: '🚗' },
    { household_id: newHousehold.id, name: 'Dining Out', icon: '🍽️' }
  ]);
  await client.from('accounts').insert([
    { household_id: newHousehold.id, name: 'Cash', active: true }
  ]);

  return newHousehold;
};

export const fetchAllHouseholdData = async (householdId) => {
  const client = getClient();
  const [
    tasksRes,
    groceriesRes,
    recipesRes,
    expensesRes,
    menuRes,
    categoriesRes,
    accountsRes,
    settingsRes,
  ] = await Promise.all([
    client.from('tasks').select('*').eq('household_id', householdId).order('created_at', { ascending: false }),
    client.from('groceries').select('*').eq('household_id', householdId).order('created_at', { ascending: false }),
    client.from('recipes').select('*').eq('household_id', householdId).order('created_at', { ascending: false }),
    client.from('expenses').select('*').eq('household_id', householdId).order('expense_date', { ascending: false }),
    client.from('menu_plans').select('*').eq('household_id', householdId),
    client.from('categories').select('*').eq('household_id', householdId).order('sort_order'),
    client.from('accounts').select('*').eq('household_id', householdId).order('sort_order'),
    client.from('household_settings').select('*').eq('household_id', householdId).maybeSingle(),
  ]);

  [tasksRes, groceriesRes, recipesRes, expensesRes, menuRes, categoriesRes, accountsRes].forEach((res) => {
    if (res.error) throw res.error;
  });

  if (settingsRes.error) throw settingsRes.error;

  return {
    tasks: (tasksRes.data || []).map(mapTask),
    groceries: (groceriesRes.data || []).map(mapGrocery),
    recipes: (recipesRes.data || []).map(mapRecipe),
    expenses: (expensesRes.data || []).map(mapExpense),
    menuPlan: mapMenuPlans(menuRes.data || []),
    categories: (categoriesRes.data || []).map(mapCategory),
    accounts: (accountsRes.data || []).map(mapAccount),
    monthlyBudget: Number(settingsRes.data?.monthly_budget ?? 60000),
    theme: settingsRes.data?.theme ?? 'sage-sand',
  };
};

// Tasks CRUD
export const createTask = async (householdId, userId, ownerName, task) => {
  const { data, error } = await getClient()
    .from('tasks')
    .insert(taskToDb(task, householdId, userId, ownerName))
    .select()
    .single();
  if (error) throw error;
  return mapTask(data);
};

export const updateTask = async (id, updates) => {
  const { data, error } = await getClient()
    .from('tasks')
    .update({
      title: updates.title,
      description: updates.desc,
      owner: updates.owner,
      done: updates.done,
      completed_by: updates.completedBy,
      // FEATURE 8: Assign fields mapped directly to the update call
      assigned_to_user_id: updates.assignedToId,
      assigned_to_name: updates.assignedToName
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapTask(data);
};

export const deleteTask = async (id) => {
  const { error } = await getClient().from('tasks').delete().eq('id', id);
  if (error) throw error;
};

// Groceries CRUD
export const createGrocery = async (householdId, userId, ownerName, item) => {
  const { data, error } = await getClient()
    .from('groceries')
    .insert(groceryToDb(item, householdId, userId, ownerName))
    .select()
    .single();
  if (error) throw error;
  return mapGrocery(data);
};

export const updateGrocery = async (id, updates) => {
  const { data, error } = await getClient()
    .from('groceries')
    .update({
      name: updates.name,
      qty_str: updates.qtyStr,
      note: updates.note,
      owner: updates.owner,
      done: updates.done,
      completed_by: updates.completedBy,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapGrocery(data);
};

export const deleteGrocery = async (id) => {
  const { error } = await getClient().from('groceries').delete().eq('id', id);
  if (error) throw error;
};

// Recipes CRUD
export const createRecipe = async (householdId, userId, ownerName, recipe) => {
  const { data, error } = await getClient()
    .from('recipes')
    .insert(recipeToDb(recipe, householdId, userId, ownerName))
    .select()
    .single();
  if (error) throw error;
  return mapRecipe(data);
};

export const updateRecipe = async (id, updates) => {
  const { data, error } = await getClient()
    .from('recipes')
    .update({
      title: updates.title,
      ingredients: updates.ingredients,
      steps: updates.steps,
      tags: updates.tags,
      note: updates.note,
      owner: updates.owner,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapRecipe(data);
};

export const deleteRecipe = async (id) => {
  const { error } = await getClient().from('recipes').delete().eq('id', id);
  if (error) throw error;
};

// Expenses CRUD
export const createExpense = async (householdId, userId, ownerName, expense) => {
  const { data, error } = await getClient()
    .from('expenses')
    .insert(expenseToDb(expense, householdId, userId, ownerName))
    .select()
    .single();
  if (error) throw error;
  return mapExpense(data);
};

export const updateExpense = async (id, updates) => {
  const { data, error } = await getClient()
    .from('expenses')
    .update({
      amount: updates.amount,
      category_id: updates.categoryId,
      account_id: updates.accountId,
      expense_date: updates.date,
      note: updates.note,
      owner: updates.owner,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapExpense(data);
};

export const deleteExpense = async (id) => {
  const { error } = await getClient().from('expenses').delete().eq('id', id);
  if (error) throw error;
};

// Menu plan
export const upsertMenuPlan = async (householdId, day, meal, recipeId) => {
  const { data, error } = await getClient()
    .from('menu_plans')
    .upsert(
      { household_id: householdId, day_abbr: day, meal, recipe_id: recipeId },
      { onConflict: 'household_id,day_abbr,meal' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteMenuPlan = async (householdId, day, meal) => {
  const { error } = await getClient()
    .from('menu_plans')
    .delete()
    .match({ household_id: householdId, day_abbr: day, meal });
  if (error) throw error;
};

// Config
export const createCategory = async (householdId, category) => {
  const { data, error } = await getClient()
    .from('categories')
    .insert({ household_id: householdId, name: category.name, icon: category.icon || '🏷️' })
    .select()
    .single();
  if (error) throw error;
  return mapCategory(data);
};

export const createAccount = async (householdId, account) => {
  const { data, error } = await getClient()
    .from('accounts')
    .insert({ household_id: householdId, name: account.name, active: account.active ?? true })
    .select()
    .single();
  if (error) throw error;
  return mapAccount(data);
};

export const updateAccount = async (id, updates) => {
  const { data, error } = await getClient()
    .from('accounts')
    .update({ active: updates.active, name: updates.name })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapAccount(data);
};

export const updateHouseholdSettings = async (householdId, updates) => {
  const { data, error } = await getClient()
    .from('household_settings')
    .update({
      monthly_budget: updates.monthlyBudget,
      theme: updates.theme,
    })
    .eq('household_id', householdId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Realtime subscriptions
let activeChannel = null;

export const subscribeToHousehold = (householdId, handlers) => {
  const client = getClient();
  if (activeChannel) {
    client.removeChannel(activeChannel);
  }

  activeChannel = client
    .channel(`household:${householdId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onTasks?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'groceries', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onGroceries?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'recipes', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onRecipes?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onExpenses?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_plans', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onMenuPlans?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categories', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onCategories?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'accounts', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onAccounts?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'household_settings', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onSettings?.(payload))
    .on('postgres_changes', { event: '*', schema: 'public', table: 'household_members', filter: `household_id=eq.${householdId}` }, (payload) => handlers.onMembers?.(payload))
    .subscribe();

  return activeChannel;
};

export const unsubscribeFromHousehold = () => {
  if (activeChannel && supabase) {
    supabase.removeChannel(activeChannel);
    activeChannel = null;
  }
};

export const handleRealtimePayload = (payload, mapper, setAction, deleteAction) => {
  if (payload.eventType === 'DELETE') {
    return deleteAction(payload.old.id);
  }
  const mapped = mapper(payload.new);
  if (payload.eventType === 'INSERT') {
    return setAction(mapped, 'insert');
  }
  return setAction(mapped, 'update');
};