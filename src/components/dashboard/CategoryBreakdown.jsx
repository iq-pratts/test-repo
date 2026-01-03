import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useExpenses } from '@/context/ExpenseContext';
import { useCurrency } from '@/context/CurrencyContext';
export const CATEGORY_CONFIG= {
  food: { label: 'Food & Dining', icon: '🍔', color: 'hsl(24, 95%, 53%)' },
  transport: { label: 'Transportation', icon: '🚗', color: 'hsl(221, 83%, 53%)' },
  shopping: { label: 'Shopping', icon: '🛍️', color: 'hsl(280, 87%, 60%)' },
  entertainment: { label: 'Entertainment', icon: '🎬', color: 'hsl(340, 82%, 52%)' },
  bills: { label: 'Bills & Utilities', icon: '📄', color: 'hsl(199, 89%, 48%)' },
  healthcare: { label: 'Healthcare', icon: '💊', color: 'hsl(160, 84%, 39%)' },
  education: { label: 'Education', icon: '📚', color: 'hsl(45, 93%, 47%)' },
  travel: { label: 'Travel', icon: '✈️', color: 'hsl(180, 77%, 42%)' },
  other: { label: 'Other', icon: '📦', color: 'hsl(215, 16%, 47%)' },
};


export function CategoryBreakdown() {
  const { getTotalByCategory } = useExpenses();
  const { formatCurrency } = useCurrency();
  const categoryTotals = getTotalByCategory();

  const data = Object.entries(categoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: CATEGORY_CONFIG[category].label,
      value,
      color: CATEGORY_CONFIG[category].color,
      icon: CATEGORY_CONFIG[category].icon,
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-sm animate-fade-in">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Category Breakdown</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Where your money goes</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="45%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(214, 32%, 91%)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px',
                }}
                formatter={(value) => [formatCurrency(value), '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2 sm:space-y-3 w-full">
          {data.slice(0, 5).map((item) => (
            <div key={item.name} className="flex items-center gap-2 sm:gap-3">
              <span className="text-base sm:text-lg">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className="text-xs sm:text-sm font-medium text-foreground truncate">{item.name}</span>
                  <span className="text-xs sm:text-sm font-semibold text-foreground shrink-0">
                    {formatCurrency(item.value)}
                  </span>
                </div>
                <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / total) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
