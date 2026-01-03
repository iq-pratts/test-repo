import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { useExpenses } from '@/context/ExpenseContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Wallet, TrendingDown, Target, PiggyBank } from 'lucide-react';

export default function Dashboard() {
  const { expenses, getMonthlyTotal } = useExpenses();
  const { formatCurrency } = useCurrency();
  const monthlyTotal = getMonthlyTotal();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Track your financial health at a glance</p>
        </div>

        {/* Stats Grid - 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Monthly Spending"
            value={formatCurrency(monthlyTotal)}
            change="12% vs last month"
            changeType="negative"
            icon={Wallet}
            iconColor="bg-primary/10 text-primary"
          />
          <StatCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            change={`${expenses.length} transactions`}
            changeType="neutral"
            icon={TrendingDown}
            iconColor="bg-destructive/10 text-destructive"
          />
          <StatCard
            title="Budget Remaining"
            value={formatCurrency(1180)}
            change="59% remaining"
            changeType="positive"
            icon={Target}
            iconColor="bg-success/10 text-success"
          />
          <StatCard
            title="Savings Goal"
            value={formatCurrency(3500)}
            change="On track"
            changeType="positive"
            icon={PiggyBank}
            iconColor="bg-accent/10 text-accent"
          />
        </div>

        {/* Charts Row - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <SpendingChart />
          <CategoryBreakdown />
        </div>

        {/* Bottom Row - Stack on mobile/tablet */}
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
