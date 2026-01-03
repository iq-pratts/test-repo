import { AppLayout } from '@/components/layout/AppLayout';
import { AddGoalDialog } from '@/components/goals/AddGoalDialog';
import { GoalList } from '@/components/goals/GoalList';
import { useGoals } from '@/context/GoalContext';

export default function Goals() {
    const { goals } = useGoals();

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Financial Goals</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            You have {goals.length} active goals.
                        </p>
                    </div>
                    <AddGoalDialog />
                </div>
                <GoalList goals={goals} />
            </div>
        </AppLayout>
    );
}
