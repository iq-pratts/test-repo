import { useState } from 'react';
import { useGoals } from '@/context/GoalContext';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export function AddGoalDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { addGoal } = useGoals();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !targetAmount || !targetDate) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            await addGoal({ name, targetAmount: parseFloat(targetAmount), targetDate, currentAmount: 0 });
            setName('');
            setTargetAmount('');
            setTargetDate('');
            setIsOpen(false);
        } catch (error) {
            console.error("Error adding goal: ", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add New Goal</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Financial Goal</DialogTitle>
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
                        <Button type="submit">Add Goal</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
