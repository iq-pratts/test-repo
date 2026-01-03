import { useState } from 'react';
import { useIncome } from '@/context/IncomeContext';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';

const CATEGORY_OPTIONS = {
    salary: 'Salary',
    investment: 'Investment',
    freelance: 'Freelance',
    business: 'Business',
    other: 'Other',
};

export function AddIncomeDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const { addIncome } = useIncome();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount || !category || !date) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            await addIncome({ description, amount: parseFloat(amount), category, date });
            setDescription('');
            setAmount('');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]);
            setIsOpen(false);
        } catch (error) {
            console.error("Error adding income: ", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    <span>Add Income</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Income</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="amount" className="text-sm font-medium">Amount</label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="category" className="text-sm font-medium">Category</label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(CATEGORY_OPTIONS).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="date" className="text-sm font-medium">Date</label>
                        <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Add Income</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
