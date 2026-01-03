import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIncome } from '@/context/IncomeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CATEGORY_OPTIONS = {
    salary: 'Salary',
    investment: 'Investment',
    freelance: 'Freelance',
    business: 'Business',
    other: 'Other',
};

export function EditIncomeDialog({ income, onClose }) {
  const { updateIncome } = useIncome();
  const { currencySymbol } = useCurrency();
  
  const [amount, setAmount] = useState(income.amount.toString());
  const [category, setCategory] = useState(income.category);
  const [description, setDescription] = useState(income.description);
  const [date, setDate] = useState(
    format(new Date(income.date), 'yyyy-MM-dd')
  );
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
      console.log('[EditIncome] Submitting updates for:', income.id);
      
      await updateIncome(income.id, {
        amount: parseFloat(amount),
        category,
        description,
        date,
      });

      console.log('[EditIncome] ✅ Income updated successfully');
      toast.success('Income updated successfully!');
      onClose();
    } catch (error) {
      console.error('[EditIncome] ❌ Error:', error);
      const errorMessage = error.message || 'Failed to update income';
      setErrors(prev => ({ ...prev, submit: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Income</DialogTitle>
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
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_OPTIONS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this income for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
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
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Income'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
