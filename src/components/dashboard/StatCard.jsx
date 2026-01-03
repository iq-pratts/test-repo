import { cn } from '@/lib/utils';

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon,
  iconColor = 'bg-primary/10 text-primary'
}) {
  return (
    <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground truncate">{value}</p>
          {change && (
            <p className={cn(
              'text-xs sm:text-sm font-medium flex items-center gap-1',
              changeType === 'positive' && 'text-success',
              changeType === 'negative' && 'text-destructive',
              changeType === 'neutral' && 'text-muted-foreground'
            )}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              <span className="truncate">{change}</span>
            </p>
          )}
        </div>
        <div className={cn('p-2 sm:p-3 rounded-lg sm:rounded-xl shrink-0', iconColor)}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
        </div>
      </div>
    </div>
  );
}
