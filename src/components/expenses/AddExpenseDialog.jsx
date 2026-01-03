import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useExpenses } from '@/context/ExpenseContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
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

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const { addExpense } = useExpenses();
  const { currencySymbol } = useCurrency();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    } else if (description.length > 100) {
      newErrors.description = 'Description should be less than 100 characters';
    }
    
    if (!date) {
      newErrors.date = 'Please select a date';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('[AddExpense] Submitting form with:', { amount, category, description, date });
      
      await addExpense({
        amount: parseFloat(amount),
        category,
        description,
        date,
        type: 'private',
      });

      console.log('[AddExpense] ✅ Expense added successfully');
      toast.success('Expense added successfully!');
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('[AddExpense] ❌ Error:', error);
      const errorMessage = error.message || 'Failed to add expense';
      setErrors(prev => ({ ...prev, submit: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currencySymbol})</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {errors.submit && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded-md text-sm flex gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
