import { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useExpenses } from '@/context/ExpenseContext';
import { useIncome } from '@/context/IncomeContext';
import { useGoals } from '@/context/GoalContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useBudget } from '@/context/BudgetContext';
import { Wallet, TrendingUp, Target, PiggyBank } from 'lucide-react';

export default function Dashboard() {
  const { expenses, getMonthlyTotal: getMonthlyExpenseTotal } = useExpenses();
  const { incomes, getMonthlyTotal: getMonthlyIncomeTotal } = useIncome();
  const { goals } = useGoals();
  const { formatCurrency } = useCurrency();
  const { budget } = useBudget();

  const monthlyExpenses = useMemo(() => getMonthlyExpenseTotal(), [expenses, getMonthlyExpenseTotal]);
  const monthlyIncome = useMemo(() => getMonthlyIncomeTotal(), [incomes, getMonthlyIncomeTotal]);
  const budgetRemaining = useMemo(() => budget - monthlyExpenses, [budget, monthlyExpenses]);
  const totalGoalsSaved = useMemo(() => goals.reduce((sum, g) => sum + g.currentAmount, 0), [goals]);
  const totalGoalsTarget = useMemo(() => goals.reduce((sum, g) => sum + g.targetAmount, 0), [goals]);

  const savingsGoalProgress = totalGoalsTarget > 0 ? (totalGoalsSaved / totalGoalsTarget) * 100 : 0;

  const hasData = useMemo(() => expenses.length > 0 || incomes.length > 0 || goals.length > 0, [expenses, incomes, goals]);

  if (!hasData) {
    return (
      <AppLayout>
        <div className="p-4 sm:p-6 lg:p-8 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2">Welcome!</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            It looks like you don't have any data yet. Add some incomes, expenses, or goals to get started.
          </p>
          <QuickActions />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Here's a summary of your financial activity for the month.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Monthly Income"
            value={formatCurrency(monthlyIncome)}
            change={`${incomes.length} transactions`}
            changeType="neutral"
            icon={TrendingUp}
            iconColor="bg-success/10 text-success"
          />
          <StatCard
            title="Monthly Spending"
            value={formatCurrency(monthlyExpenses)}
            change={`${expenses.length} transactions`}
            changeType="neutral"
            icon={Wallet}
            iconColor="bg-primary/10 text-primary"
          />
          <StatCard
            title="Budget Remaining"
            value={formatCurrency(budgetRemaining)}
            change={budgetRemaining >= 0 ? "You're in the green" : "You're in the red"}
            changeType={budgetRemaining >= 0 ? 'positive' : 'negative'}
            icon={Target}
            iconColor="bg-accent/10 text-accent"
          />
          <StatCard
            title="Savings Goal"
            value={formatCurrency(totalGoalsSaved)}
            change={`${savingsGoalProgress.toFixed(0)}% of your goal`}
            changeType={savingsGoalProgress >= 50 ? "positive" : "neutral"}
            icon={PiggyBank}
            iconColor="bg-success/10 text-success"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <SpendingChart />
          <CategoryBreakdown />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2">
            <RecentTransactions />
          </div>
          <QuickActions />
        </div>
      </div>
    </AppLayout>
  );
}
