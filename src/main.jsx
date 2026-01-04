import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import { IncomeProvider } from './context/IncomeContext';
import { GoalProvider } from './context/GoalContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { BudgetProvider } from './context/BudgetContext';
import { Toaster } from '@/components/ui/sonner';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <ExpenseProvider>
            <IncomeProvider>
                <GoalProvider>
                    <CurrencyProvider>
                        <BudgetProvider>
                            <App />
                            <Toaster />
                        </BudgetProvider>
                    </CurrencyProvider>
                </GoalProvider>
            </IncomeProvider>
        </ExpenseProvider>
    </AuthProvider>
);
