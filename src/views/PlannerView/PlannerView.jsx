import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { saveRecipe, removeRecipe } from '../../store/slices/recipesSlice';
import { assignMealRemote } from '../../store/slices/menuPlanSlice';
import { showToast, setIsCreatingRecipe } from '../../store/slices/uiSlice';
import { WEEK_DAYS } from '../../data';
import MealSlot from '../../components/MealSlot';
import RecipeDetailModal from '../../modals/RecipeDetailModal';
import RecipeCreationModal from '../../modals/RecipeCreationModal';
import MenuAssignmentModal from '../../modals/MenuAssignmentModal';
import './PlannerView.scss';

const PlannerView = () => {
  const dispatch = useAppDispatch();
  const recipes = useAppSelector((state) => state.recipes.items);
  const menuPlan = useAppSelector((state) => state.menuPlan.plan);
  const currentUser = useAppSelector((state) => state.config.currentUser);
  const isCreatingRecipe = useAppSelector((state) => state.ui.isCreatingRecipe);

  const [plannerTab, setPlannerTab] = useState('menu');
  const [viewingRecipe, setViewingRecipe] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');

  const handleSaveRecipe = async (recipeData) => {
    const result = await dispatch(saveRecipe({ recipe: recipeData, isEdit: Boolean(viewingRecipe) }));
    if (saveRecipe.fulfilled.match(result)) {
      dispatch(showToast(viewingRecipe ? 'Recipe updated' : 'Recipe created'));
      dispatch(setIsCreatingRecipe(false));
      setViewingRecipe(null);
    } else {
      dispatch(showToast(result.payload || 'Failed to save recipe'));
    }
  };

  const handleDeleteRecipe = async (id) => {
    const result = await dispatch(removeRecipe(id));
    if (removeRecipe.fulfilled.match(result)) {
      dispatch(showToast('Recipe deleted'));
      dispatch(setIsCreatingRecipe(false));
      setViewingRecipe(null);
    }
  };

  const openAssignMeal = (day, meal) => {
    setSelectedDay(day);
    setSelectedMeal(meal);
    setAssignModalOpen(true);
  };

  const assignRecipeToMeal = async (recipeId) => {
    const result = await dispatch(assignMealRemote({ day: selectedDay, meal: selectedMeal, recipeId }));
    if (assignMealRemote.fulfilled.match(result)) {
      dispatch(showToast('Meal planned'));
      setAssignModalOpen(false);
    }
  };

  const openRecipeDetail = (recipe) => {
    setViewingRecipe(recipe);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Meal Planner</h1>
        <p className="text-gray-500 text-sm mt-1">Organize your food</p>
      </div>

      <div className="flex bg-[var(--color-surface)] p-1 rounded-full mb-4 shadow-sm border border-gray-100 shrink-0">
        <button onClick={() => setPlannerTab('menu')} className={`flex-1 text-xs py-2 rounded-full font-bold transition-colors ${plannerTab === 'menu' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-500'}`}>Weekly Menu</button>
        <button onClick={() => setPlannerTab('recipes')} className={`flex-1 text-xs py-2 rounded-full font-bold transition-colors ${plannerTab === 'recipes' ? 'bg-[var(--color-primary)] text-white shadow-sm' : 'text-gray-500'}`}>Recipes Archive</button>
      </div>

      <div className="flex-1 overflow-y-auto pb-6">
        {plannerTab === 'menu' ? (
          <div className="flex flex-col gap-4">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="bg-[var(--color-surface)] rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-[var(--color-text)] mb-3">{day}</h3>
                <div className="flex flex-col gap-2">
                  <MealSlot meal="breakfast" icon="🍳" recipeId={menuPlan[day]?.breakfast} recipes={recipes} onClick={() => openAssignMeal(day, 'breakfast')} />
                  <MealSlot meal="lunch" icon="🥗" recipeId={menuPlan[day]?.lunch} recipes={recipes} onClick={() => openAssignMeal(day, 'lunch')} />
                  <MealSlot meal="dinner" icon="🍝" recipeId={menuPlan[day]?.dinner} recipes={recipes} onClick={() => openAssignMeal(day, 'dinner')} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <button onClick={() => { setViewingRecipe(null); dispatch(setIsCreatingRecipe(true)); }} className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-4 rounded-2xl text-sm font-bold hover:bg-[var(--color-surface)] hover:border-gray-400 transition-colors flex items-center justify-center gap-2">
              <span className="text-xl">＋</span> Create New Recipe
            </button>
            <div className="grid grid-cols-2 gap-3">
              {recipes.map((recipe) => (
                <div key={recipe.id} onClick={() => openRecipeDetail(recipe)} className="bg-[var(--color-surface)] p-3 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between min-h-[120px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {recipe.tags.slice(0, 2).map((tag) => <span key={tag} className="px-1.5 py-0.5 bg-[var(--color-bg)] text-[var(--color-primary)] rounded text-[8px] font-bold uppercase">{tag}</span>)}
                    </div>
                    <h4 className="font-bold text-sm text-[var(--color-text)] break-words min-w-0">{recipe.title}</h4>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 font-bold shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> {recipe.owner}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <RecipeDetailModal
        isOpen={!!viewingRecipe && !isCreatingRecipe}
        onClose={() => setViewingRecipe(null)}
        recipe={viewingRecipe}
        onEdit={() => dispatch(setIsCreatingRecipe(true))}
        onDelete={() => handleDeleteRecipe(viewingRecipe.id)}
      />
      <RecipeCreationModal
        isOpen={isCreatingRecipe}
        onClose={() => { dispatch(setIsCreatingRecipe(false)); if (!viewingRecipe) setViewingRecipe(null); }}
        onSave={handleSaveRecipe}
        initialData={viewingRecipe}
        currentUser={currentUser}
      />
      <MenuAssignmentModal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        recipes={recipes}
        onAssign={assignRecipeToMeal}
        onCreateNew={() => { setAssignModalOpen(false); setViewingRecipe(null); dispatch(setIsCreatingRecipe(true)); }}
      />
    </div>
  );
};

export default PlannerView;
