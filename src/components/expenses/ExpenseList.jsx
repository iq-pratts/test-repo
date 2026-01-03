import { useExpenses } from '@/context/ExpenseContext';
import { useCurrency } from '@/context/CurrencyContext';
import { format } from 'date-fns';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EditExpenseDialog } from './EditExpenseDialog';
import { useState } from 'react';

export const CATEGORY_CONFIG = {
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

export function ExpenseList({ expenses = null }) {
  const { expenses: allExpenses, deleteExpense } = useExpenses();
  const { formatCurrency } = useCurrency();
  const [editingExpense, setEditingExpense] = useState(null);

  // Use passed expenses if provided, otherwise use all expenses
  const displayExpenses = expenses ?? allExpenses;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(id);
      toast.success('Expense deleted');
    }
  };

  if (!displayExpenses || displayExpenses.length === 0) {
    return (
      <div className="bg-card rounded-lg sm:rounded-xl p-8 border border-border text-center">
        <p className="text-muted-foreground">No expenses found</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        {displayExpenses.map((expense, index) => {
          const config = CATEGORY_CONFIG[expense.category];
          return (
            <div
              key={expense.id}
              className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base text-foreground truncate">{expense.description}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {config.label} • {format(new Date(expense.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <p className="font-bold text-sm sm:text-base lg:text-lg text-foreground whitespace-nowrap">
                    {formatCurrency(expense.amount)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingExpense(expense)}
                    className="text-muted-foreground hover:text-primary h-8 w-8"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(expense.id)}
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Dialog */}
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </>
  );
}
