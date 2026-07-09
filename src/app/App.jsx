import { useAppDispatch, useAppSelector } from '../store';
import { setActiveTab } from '../store/slices/uiSlice';
import Toast from '../components/Toast';
import BottomNav from '../components/BottomNav';
import {
  DashboardView,
  TodoView,
  GroceriesView,
  PlannerView,
  ExpensesView,
  AdminView,
} from '../views';
import './App.scss';

const App = () => {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const toastMsg = useAppSelector((state) => state.ui.toastMsg);
  const theme = useAppSelector((state) => state.ui.theme);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'todo':
        return <TodoView />;
      case 'groceries':
        return <GroceriesView />;
      case 'planner':
        return <PlannerView />;
      case 'expenses':
        return <ExpensesView />;
      case 'admin':
        return <AdminView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <span className="text-3xl mb-2">🚧</span>
            <p className="text-gray-500">Coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="app-shell__container">
        <Toast message={toastMsg} />

        <div className="app-shell__content">
          {renderContent()}
        </div>

        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => dispatch(setActiveTab(tab))}
        />
      </div>
    </div>
  );
};

export default App;
