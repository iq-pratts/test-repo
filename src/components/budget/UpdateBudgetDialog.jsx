import { useState } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCurrency } from '@/context/CurrencyContext';

export function UpdateBudgetDialog({ isOpen, onClose }) {
    const { budget, updateBudget } = useBudget();
    const [newBudget, setNewBudget] = useState(budget);
    const { currency } = useCurrency();

    const handleSave = () => {
        updateBudget(parseFloat(newBudget));
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Monthly Budget</DialogTitle>
                    <DialogDescription>
                        Set a new monthly budget. This will be used to calculate your remaining budget.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="budget-amount" className="text-right">
                            Amount ({currency.symbol})
                        </label>
                        <Input
                            id="budget-amount"
                            type="number"
                            value={newBudget}
                            onChange={(e) => setNewBudget(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
