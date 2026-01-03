import { cn } from '@/lib/utils';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    LayoutDashboard,
    Receipt,
    Users,
    Brain,
    GraduationCap,
    Settings,
    LogOut,
    TrendingUp,
    Target,
    DollarSign
} from 'lucide-react';
import { CurrencySwitcher } from './CurrencySwitcher';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { SignOutConfirmModal } from '@/components/modals/SignOutConfirmModal';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Receipt, label: 'Expenses', path: '/expenses' },
    { icon: DollarSign, label: 'Income', path: '/income' },
    { icon: Target, label: 'Goals', path: '/goals' },
    { icon: Users, label: 'Groups', path: '/groups' },
    { icon: Brain, label: 'AI Advisor', path: '/advisor' },
    { icon: GraduationCap, label: 'Learn', path: '/learn' },
];

export function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSettings = () => {
        navigate('/profile');
    };

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await logout();
            toast.success('Signed out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to sign out');
        } finally {
            setIsLoading(false);
            setShowSignOutConfirm(false);
        }
    };

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
            {/* Logo */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                        <TrendingUp className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">SmartFin</h1>
                        <p className="text-xs text-muted-foreground">Financial Intelligence</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border space-y-1">
                <CurrencySwitcher />
                <button
                    onClick={handleSettings}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary w-full transition-all duration-200"
                >
                    <Settings className="w-5 h-5" />
                    Settings
                </button>
                <button
                    onClick={() => setShowSignOutConfirm(true)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>

            <SignOutConfirmModal
                isOpen={showSignOutConfirm}
                isLoading={isLoading}
                onConfirm={handleSignOut}
                onCancel={() => setShowSignOutConfirm(false)}
            />
        </aside>
    );
}
