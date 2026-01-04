import { useState } from 'react';
import { useGoals } from '@/context/GoalContext';
import { useCurrency } from '@/context/CurrencyContext';
import { EditGoalDialog } from './EditGoalDialog';
import { MoreVertical, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AddFundsDialog } from './AddFundsDialog';

export function GoalList({ goals }) {
    const { deleteGoal } = useGoals();
    const { formatCurrency } = useCurrency();
    const [editingGoal, setEditingGoal] = useState(null);
    const [addingFundsGoal, setAddingFundsGoal] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await deleteGoal(id);
            } catch (error) {
                console.error("Error deleting goal: ", error);
            }
        }
    };

    return (
        <div className="space-y-4">
            {goals.map((goal) => (
                <div key={goal.id} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg text-foreground">{goal.name}</h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingGoal(goal)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(goal.id)} className="text-destructive">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-muted-foreground text-sm">Progress</span>
                            <span className="font-semibold text-foreground">
                                {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                            </span>
                        </div>
                        <Progress value={(goal.currentAmount / goal.targetAmount) * 100} />
                        <div className="flex justify-between items-end">
                            <span className="text-muted-foreground text-sm">Target Date: {new Date(goal.date).toLocaleDateString()}</span>
                            <Button size="sm" onClick={() => setAddingFundsGoal(goal)}>Add Funds</Button>
                        </div>
                    </div>
                </div>
            ))}
            {editingGoal && (
                <EditGoalDialog
                    goal={editingGoal}
                    onClose={() => setEditingGoal(null)}
                />
            )}
            {addingFundsGoal && (
                <AddFundsDialog
                    goal={addingFundsGoal}
                    onClose={() => setAddingFundsGoal(null)}
                />
            )}
        </div>
    );
}
