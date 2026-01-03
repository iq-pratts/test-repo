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

export function EditGoalDialog({ goal, onClose }) {
    const { updateGoal } = useGoals();
    const [name, setName] = useState(goal.name);
    const [targetAmount, setTargetAmount] = useState(goal.targetAmount);
    const [targetDate, setTargetDate] = useState(goal.targetDate);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !targetAmount || !targetDate) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            await updateGoal(goal.id, { name, targetAmount: parseFloat(targetAmount), targetDate });
            onClose();
        } catch (error) {
            console.error("Error updating goal: ", error);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium">Goal Name</label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="targetAmount" className="text-sm font-medium">Target Amount</label>
                        <Input id="targetAmount" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="targetDate" className="text-sm font-medium">Target Date</label>
                        <Input id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Update Goal</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
