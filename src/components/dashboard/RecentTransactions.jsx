import { useExpenses } from '@/context/ExpenseContext';
import { useCurrency } from '@/context/CurrencyContext';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CATEGORY_CONFIG= {
  food: { label: 'Food & Dining', icon: '🍔', color: 'hsl(24, 95%, 53%)' },
  transport: { label: 'Transportation', icon: '🚗', color: 'hsl(221, 83%, 53%)' },
  shopping: { label: 'Shopping', icon: '🛍️', color: 'hsl(280, 87%, 60%)' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: 'hsl(340, 82%, 52%)' },
  bills: { label: 'Bills & Utilities', icon: '📄', color: 'hsl(199, 89%, 48%)' },
  healthcare: { label: 'Healthcare', icon: '💊', color: 'hsl(160, 84%, 39%)' },
  education: { label: 'Education', icon: '📚', color: 'hsl(45, 93%, 47%)' },
  travel: { label: 'Travel', icon: '✈️', color: 'hsl(180, 77%, 42%)' },
  other: { label: 'Other', icon: '📦', color: 'hsl(215, 16%, 47%)' },
};

export function RecentTransactions() {
  const { expenses } = useExpenses();
  const { formatCurrency } = useCurrency();
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Your latest expenses</p>
        </div>
        <Link
          to="/expenses"
          className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors shrink-0"
        >
          View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </Link>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {recentExpenses.map((expense) => {
          const config = CATEGORY_CONFIG[expense.category];
          return (
            <div
              key={expense.id}
              className="flex items-center gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0"
                style={{ backgroundColor: `${config.color}20` }}
              >
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm sm:text-base text-foreground truncate">{expense.description}</p>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {config.label} • {format(new Date(expense.date), 'MMM d')}
                </p>
              </div>
              <p className="font-semibold text-sm sm:text-base text-foreground whitespace-nowrap">
                -{formatCurrency(expense.amount)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
