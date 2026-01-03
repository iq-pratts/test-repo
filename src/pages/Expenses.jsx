import { AppLayout } from '@/components/layout/AppLayout';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { AddExpenseDialog } from '@/components/expenses/AddExpenseDialog';
import { useExpenses } from '@/context/ExpenseContext';
import { useCurrency } from '@/context/CurrencyContext';
import { Search, Filter, Download, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const CATEGORY_OPTIONS = {
    food: 'Food & Dining',
    transport: 'Transportation',
    shopping: 'Shopping',
    entertainment: 'Entertainment',
    bills: 'Bills & Utilities',
    healthcare: 'Healthcare',
    education: 'Education',
    travel: 'Travel',
    other: 'Other',
};

const ITEMS_PER_PAGE = 10;

export default function Expenses() {
    const { expenses, loading } = useExpenses();
    const { formatCurrency } = useCurrency();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter expenses
    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const matchesSearch =
                expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                expense.category.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !selectedCategory || expense.category === selectedCategory;

            let matchesDateRange = true;
            if (fromDate || toDate) {
                const expenseDate = new Date(expense.date);
                if (fromDate) {
                    const from = new Date(fromDate);
                    from.setHours(0, 0, 0, 0);
                    matchesDateRange = expenseDate >= from;
                }
                if (toDate && matchesDateRange) {
                    const to = new Date(toDate);
                    to.setHours(23, 59, 59, 999);
                    matchesDateRange = expenseDate <= to;
                }
            }

            return matchesSearch && matchesCategory && matchesDateRange;
        });
    }, [expenses, searchQuery, selectedCategory, fromDate, toDate]);

    // Pagination
    const totalPages = Math.ceil(filteredExpenses.length / ITEMS_PER_PAGE);
    const paginatedExpenses = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredExpenses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredExpenses, currentPage]);

    // Reset to first page when filters change
    const handleFilterChange = (setter) => (value) => {
        setCurrentPage(1);
        setter(value);
    };

    const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate this week's expenses
    const getThisWeekTotal = () => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        return filteredExpenses
            .filter(e => new Date(e.date) >= startOfWeek)
            .reduce((sum, e) => sum + e.amount, 0);
    };

    // Calculate this month's expenses
    const getThisMonthTotal = () => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        return filteredExpenses
            .filter(e => {
                const expenseDate = new Date(e.date);
                return (
                    expenseDate.getMonth() === currentMonth &&
                    expenseDate.getFullYear() === currentYear
                );
            })
            .reduce((sum, e) => sum + e.amount, 0);
    };

    // Calculate average expense per transaction
    const getAverageExpense = () => {
        return filteredExpenses.length > 0 ? totalAmount / filteredExpenses.length : 0;
    };

    const handleExport = () => {
        const csvContent = [
            ['Date', 'Description', 'Category', 'Amount'].join(','),
            ...filteredExpenses.map(e => [
                new Date(e.date).toLocaleDateString(),
                e.description,
                e.category,
                e.amount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setFromDate('');
        setToDate('');
        setCurrentPage(1);
    };

    const hasActiveFilters = searchQuery || selectedCategory || fromDate || toDate;

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Expenses</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {paginatedExpenses.length} of {filteredExpenses.length} transactions • {formatCurrency(totalAmount)} total
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button variant="outline" size="icon" onClick={handleExport} className="shrink-0">
                            <Download className="w-4 h-4" />
                        </Button>
                        <AddExpenseDialog />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-2 sm:gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search expenses..."
                            value={searchQuery}
                            onChange={(e) => handleFilterChange(setSearchQuery)(e.target.value)}
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

                {/* Filters */}
                {showFilters && (
                    <div className="bg-card border border-border rounded-lg sm:rounded-xl p-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Category Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Category</label>
                                <Select value={selectedCategory} onValueChange={handleFilterChange(setSelectedCategory)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Categories</SelectItem>
                                        {Object.entries(CATEGORY_OPTIONS).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* From Date Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">From Date</label>
                                <Input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => handleFilterChange(setFromDate)(e.target.value)}
                                />
                            </div>

                            {/* To Date Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">To Date</label>
                                <Input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => handleFilterChange(setToDate)(e.target.value)}
                                />
                            </div>

                            {/* Clear Filters */}
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

                {/* Summary Cards */}
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
                            {formatCurrency(getAverageExpense())}
                        </p>
                    </div>
                </div>

                {/* Expense List */}
                <ExpenseList expenses={paginatedExpenses} />

                {/* Pagination */}
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
