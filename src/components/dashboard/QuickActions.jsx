import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, Brain, Download, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UpdateBudgetDialog } from '@/components/budget/UpdateBudgetDialog';

export function QuickActions() {
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  return (
    <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-sm animate-fade-in">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Common tasks at your fingertips</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <Link to="/expenses">
          <Button variant="outline" className="w-full h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <span className="text-xs sm:text-sm">Add Expense</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => setIsBudgetDialogOpen(true)}
          className="w-full h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2"
        >
          <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
          <span className="text-xs sm:text-sm">Update Budget</span>
        </Button>
        <Link to="/advisor">
          <Button variant="outline" className="w-full h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            <span className="text-xs sm:text-sm">AI Advice</span>
          </Button>
        </Link>
        {/* <Button variant="outline" className="w-full h-auto py-3 sm:py-4 flex-col gap-1.5 sm:gap-2">
          <Download className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
          <span className="text-xs sm:text-sm">Export CSV</span>
        </Button> */}
      </div>

      <UpdateBudgetDialog
        isOpen={isBudgetDialogOpen}
        onClose={() => setIsBudgetDialogOpen(false)}
      />
    </div>
  );
}
