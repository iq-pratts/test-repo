import { useCurrency, CURRENCIES, CURRENCY_DETAILS } from '@/context/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="p-4">
      <label className="text-sm font-medium text-muted-foreground">Currency</label>
      <Select value={currency} onValueChange={(value) => setCurrency(value)}>
        <SelectTrigger className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CURRENCIES.map((c) => (
            <SelectItem key={c} value={c}>
              <span className="font-medium">{c}</span>
              <span className="text-muted-foreground ml-2">{CURRENCY_DETAILS[c].name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
