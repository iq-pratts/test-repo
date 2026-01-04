import { AppLayout } from '@/components/layout/AppLayout';
import { AddGoalDialog } from '@/components/goals/AddGoalDialog';
import { GoalList } from '@/components/goals/GoalList';
import { useGoals } from '@/context/GoalContext';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 10;

export default function Goals() {
    const { goals, filters, setFilters } = useGoals();
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activePeriod, setActivePeriod] = useState(null);

    const handleFilterChange = (filterName, value) => {
        setCurrentPage(1);
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setCurrentPage(1);
        setFilters({});
        setActivePeriod(null);
    };

    const setPeriod = (period) => {
        const today = new Date();
        let startDate, endDate;

        switch (period) {
            case 'weekly':
                startDate = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split('T')[0];
                endDate = new Date(today.setDate(today.getDate() + 6)).toISOString().split('T')[0];
                break;
            case 'monthly':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
                break;
            case 'yearly':
                startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                endDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
                break;
            default:
                startDate = null;
                endDate = null;
        }

        setFilters(prev => ({ ...prev, startDate, endDate }));
        setActivePeriod(period);
    };

    // Pagination
    const totalPages = Math.ceil(goals.length / ITEMS_PER_PAGE);
    const paginatedGoals = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return goals.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [goals, currentPage]);

    const hasActiveFilters = Object.values(filters).some(v => v);

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

                <div className="flex gap-2 sm:gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search goals..."
                            value={filters.keyword || ''}
                            onChange={(e) => handleFilterChange('keyword', e.target.value)}
                            className="pl-9 sm:pl-10 text-sm"
                        />
                    </div>
                    <Button
                        variant={showFilters ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                        className="shrink-0"
                    >
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>

                {showFilters && (
                    <div className="bg-card border border-border rounded-lg sm:rounded-xl p-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">From Date</label>
                                <Input
                                    type="date"
                                    value={filters.startDate || ''}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">To Date</label>
                                <Input
                                    type="date"
                                    value={filters.endDate || ''}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                />
                            </div>

                            {hasActiveFilters && (
                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="w-full gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <Button variant={activePeriod === 'weekly' ? 'default' : 'outline'} onClick={() => setPeriod('weekly')}>Weekly</Button>
                            <Button variant={activePeriod === 'monthly' ? 'default' : 'outline'} onClick={() => setPeriod('monthly')}>Monthly</Button>
                            <Button variant={activePeriod === 'yearly' ? 'default' : 'outline'} onClick={() => setPeriod('yearly')}>Yearly</Button>
                        </div>
                    </div>
                )}

                <GoalList goals={paginatedGoals} />

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-8 h-8"
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
