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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount) {
            alert('Please enter an amount.');
            return;
        }

        const newCurrentAmount = goal.currentAmount + parseFloat(amount);

        try {
            await updateGoal(goal.id, { currentAmount: newCurrentAmount });
            onClose();
        } catch (error) {
            console.error("Error adding funds: ", error);
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
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Add Funds</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
