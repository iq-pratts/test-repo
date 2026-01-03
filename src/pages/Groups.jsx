import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Users, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCurrency } from '@/context/CurrencyContext';

const sampleGroups = [
  { id: '1', name: 'Roommates', members: 4, balance: -45.50, color: 'hsl(221, 83%, 53%)' },
  { id: '2', name: 'Trip to Paris', members: 6, balance: 120.00, color: 'hsl(160, 84%, 39%)' },
  { id: '3', name: 'Office Lunch', members: 8, balance: 0, color: 'hsl(280, 87%, 60%)' },
];

export default function Groups() {
  const [joinCode, setJoinCode] = useState('');
  const { formatCurrency } = useCurrency();

  const handleJoin = () => {
    if (joinCode.length === 6) {
      toast.success('Joined group successfully!');
      setJoinCode('');
    } else {
      toast.error('Invalid group code');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Groups</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage shared expenses with friends</p>
          </div>
          <Button className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
        </div>

        {/* Join Group */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Join a Group</h3>
          <div className="flex gap-2 sm:gap-3">
            <Input
              placeholder="Enter 6-digit code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="uppercase tracking-widest font-mono text-sm"
            />
            <Button onClick={handleJoin} className="shrink-0">Join</Button>
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-sm sm:text-base text-foreground">Your Groups</h3>
          {sampleGroups.map((group, index) => (
            <div
              key={group.id}
              className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div 
                  className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${group.color}20` }}
                >
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: group.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-foreground truncate">{group.name}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">{group.members} members</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-bold text-sm sm:text-base ${group.balance > 0 ? 'text-success' : group.balance < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {group.balance > 0 ? '+' : ''}{group.balance === 0 ? 'Settled' : formatCurrency(Math.abs(group.balance))}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {group.balance > 0 ? 'You are owed' : group.balance < 0 ? 'You owe' : ''}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Placeholder */}
        {sampleGroups.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-secondary mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Users className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">No groups yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">Create or join a group to split expenses</p>
            <Button>Create Your First Group</Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
