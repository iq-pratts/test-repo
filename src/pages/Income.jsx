import { AppLayout } from '@/components/layout/AppLayout';
import { IncomeList } from '@/components/income/IncomeList';
import { AddIncomeDialog } from '@/components/income/AddIncomeDialog';
import { useIncome } from '@/context/IncomeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Search, Filter, Download, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const CATEGORY_OPTIONS = {
    salary: 'Salary',
    investment: 'Investment',
    freelance: 'Freelance',
    business: 'Business',
    other: 'Other',
};

const ITEMS_PER_PAGE = 10;

export default function Income() {
    const { incomes, loading, filters, setFilters } = useIncome();
    const { formatCurrency } = useCurrency();
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const handleFilterChange = (filterName, value) => {
        setCurrentPage(1);
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const clearFilters = () => {
        setCurrentPage(1);
        setFilters({});
    };

    // Pagination
    const totalPages = Math.ceil(incomes.length / ITEMS_PER_PAGE);
    const paginatedIncomes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return incomes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [incomes, currentPage]);

    const totalAmount = incomes.reduce((sum, i) => sum + i.amount, 0);

    const getThisWeekTotal = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        return incomes
            .filter(i => new Date(i.date) >= startOfWeek)
            .reduce((sum, i) => sum + i.amount, 0);
    };

    const getThisMonthTotal = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return incomes
            .filter(i => {
                const itemDate = new Date(i.date);
                return (
                    itemDate.getMonth() === currentMonth &&
                    itemDate.getFullYear() === currentYear
                );
            })
            .reduce((sum, i) => sum + i.amount, 0);
    };

    const getAverageIncome = () => {
        return incomes.length > 0 ? totalAmount / incomes.length : 0;
    };

    const handleExport = () => {
        const csvContent = [
            ['Date', 'Description', 'Category', 'Amount'].join(','),
            ...incomes.map(i => [
                new Date(i.date).toLocaleDateString(),
                i.description,
                i.category,
                i.amount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `income-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const hasActiveFilters = Object.values(filters).some(v => v);

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Income</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {paginatedIncomes.length} of {incomes.length} transactions • {formatCurrency(totalAmount)} total
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button variant="outline" size="icon" onClick={handleExport} className="shrink-0">
                            <Download className="w-4 h-4" />
                        </Button>
                        <AddIncomeDialog />
                    </div>
                </div>

                <div className="flex gap-2 sm:gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search income..."
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
                                <label className="text-sm font-medium text-foreground">Category</label>
                                <Select 
                                    value={filters.category || 'all'} 
                                    onValueChange={(value) => handleFilterChange('category', value === 'all' ? '' : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {Object.entries(CATEGORY_OPTIONS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

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
                    </div>
                )}

                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">This Week</p>
                        <p className="text-sm sm:text-lg lg:text-xl font-bold text-foreground">
                            {formatCurrency(getThisWeekTotal())}
                        </p>
                    </div>
                    <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">This Month</p>
                        <p className="text-sm sm:text-lg lg:text-xl font-bold text-foreground">
                            {formatCurrency(getThisMonthTotal())}
                        </p>
                    </div>
                    <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Average</p>
                        <p className="text-sm sm:text-lg lg:text-xl font-bold text-foreground">
                            {formatCurrency(getAverageIncome())}
                        </p>
                    </div>
                </div>

                <IncomeList incomes={paginatedIncomes} />

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
