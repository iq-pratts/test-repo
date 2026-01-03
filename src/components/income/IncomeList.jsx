import { useState } from 'react';
import { useIncome } from '@/context/IncomeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { EditIncomeDialog } from './EditIncomeDialog';
import { MoreVertical, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function IncomeList({ income }) {
    const { deleteIncome } = useIncome();
    const { formatCurrency } = useCurrency();
    const [editingIncome, setEditingIncome] = useState(null);

    const handleEdit = (income) => {
        setEditingIncome(income);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this income?')) {
            try {
                await deleteIncome(id);
            } catch (error) {
                console.error("Error deleting income: ", error);
            }
        }
    };

    return (
        <div className="space-y-3">
            {income.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-lg p-3 sm:p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex-1">
                            <p className="font-medium text-foreground">{item.description}</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <p className="font-semibold text-foreground">{formatCurrency(item.amount)}</p>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(item)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ))}
            {editingIncome && (
                <EditIncomeDialog
                    income={editingIncome}
                    onClose={() => setEditingIncome(null)}
                />
            )}
        </div>
    );
}
