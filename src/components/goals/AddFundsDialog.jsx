import { useState } from 'react';
import { useGoals } from '@/context/GoalContext';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function AddFundsDialog({ goal, onClose }) {
    const { updateGoal } = useGoals();
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }

        // Assuming you have access to the user's available balance, you can add this validation
        // For example, if available balance is stored in a context:
        // const { availableBalance } = useSomeOtherContext();
        // if (parsedAmount > availableBalance) {
        //     setError('Amount must not exceed available balance.');
        //     return;
        // }

        const newCurrentAmount = goal.currentAmount + parsedAmount;

        try {
            await updateGoal(goal.id, { currentAmount: newCurrentAmount });
            onClose();
        } catch (error) {
            console.error("Error adding funds: ", error);
            setError('Failed to add funds. Please try again.');
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Funds to {goal.name}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Add Funds</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}