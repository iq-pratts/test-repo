import { useState } from 'react';
import { useGoals } from '@/context/GoalContext';
import { useCurrency } from '@/context/CurrencyContext';
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
import { Label } from '@/components/ui/label';

export function AddFundsDialog({ goal, onClose }) {
    const { updateGoal } = useGoals();
    const { formatCurrency } = useCurrency();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a positive amount.');
            return;
        }
        
        const remainingAmount = goal.targetAmount - goal.currentAmount;

        if (parsedAmount > remainingAmount) {
            setError(`Amount cannot exceed the remaining goal balance of ${formatCurrency(remainingAmount)}.`);
            return;
        }

        const newCurrentAmount = goal.currentAmount + parsedAmount;

        try {
            await updateGoal(goal.id, { currentAmount: newCurrentAmount });
            setAmount('');
            onClose();
        } catch (err) {
            console.error("Error adding funds: ", err);
            setError('Failed to add funds. Please try again.');
        }
    };
    
    const remainingAmount = goal.targetAmount - goal.currentAmount;

    if (remainingAmount <= 0) {
        return (
             <Dialog open={true} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{goal.name}</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">This goal has already been completed. Congratulations!</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Funds to {goal.name}</DialogTitle>
                     <DialogDescription>
                        Goal Target: {formatCurrency(goal.targetAmount)} | Remaining: {formatCurrency(remainingAmount)}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input 
                            id="amount" 
                            type="number" 
                            value={amount} 
                            onChange={(e) => {
                                setAmount(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder={`Max: ${formatCurrency(remainingAmount)}`}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Add Funds</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}