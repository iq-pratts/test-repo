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
    const [date, setDate] = useState('');
    const [activePeriod, setActivePeriod] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !targetAmount || !date) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            await addGoal({ name, targetAmount: parseFloat(targetAmount), date, currentAmount: 0 });
            setName('');
            setTargetAmount('');
            setDate('');
            setActivePeriod(null);
            setIsOpen(false);
        } catch (error) {
            console.error("Error adding goal: ", error);
        }
    };

    const setPeriod = (period) => {
        const today = new Date();
        let targetDate;

        switch (period) {
            case 'weekly':
                targetDate = new Date();
                targetDate.setDate(targetDate.getDate() + (6 - targetDate.getDay()));
                break;
            case 'monthly':
                targetDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'yearly':
                targetDate = new Date(today.getFullYear(), 11, 31);
                break;
            default:
                targetDate = new Date();
        }
        
        setDate(targetDate.toISOString().split('T')[0]);
        setActivePeriod(period);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                setName('');
                setTargetAmount('');
                setDate('');
                setActivePeriod(null);
            }
        }}>
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
                        <label htmlFor="date" className="text-sm font-medium">Target Date</label>
                        <Input id="date" type="date" value={date} onChange={(e) => {
                            setDate(e.target.value)
                            setActivePeriod(null)
                        }} />
                        <div className="flex items-center gap-2 pt-2">
                            <Button type="button" variant={activePeriod === 'weekly' ? 'default' : 'outline'} onClick={() => setPeriod('weekly')}>Weekly</Button>
                            <Button type="button" variant={activePeriod === 'monthly' ? 'default' : 'outline'} onClick={() => setPeriod('monthly')}>Monthly</Button>
                            <Button type="button" variant={activePeriod === 'yearly' ? 'default' : 'outline'} onClick={() => setPeriod('yearly')}>Yearly</Button>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Add Goal</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
