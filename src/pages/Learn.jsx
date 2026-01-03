import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { GraduationCap, Lightbulb, BookOpen, TrendingUp, Shield, PiggyBank, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const topics = [
  { id: 'budgeting', label: 'Budgeting', icon: PiggyBank, color: 'hsl(160, 84%, 39%)' },
  { id: 'investing', label: 'Investing', icon: TrendingUp, color: 'hsl(221, 83%, 53%)' },
  { id: 'saving', label: 'Saving', icon: Shield, color: 'hsl(280, 87%, 60%)' },
  { id: 'debt', label: 'Debt', icon: BookOpen, color: 'hsl(24, 95%, 53%)' },
];

const sampleFacts = {
  budgeting: [
    "The 50/30/20 rule suggests allocating 50% of income to needs, 30% to wants, and 20% to savings.",
    "Tracking expenses for just one month can reveal surprising spending patterns.",
    "Automating bill payments can help avoid late fees and improve credit scores.",
    "Zero-based budgeting assigns every dollar a purpose, reducing wasteful spending.",
    "Regular budget reviews help adapt to changing financial circumstances.",
  ],
  investing: [
    "Compound interest can double your money every 7-10 years at a 7-10% return.",
    "Diversification across asset classes reduces portfolio risk.",
    "Index funds typically outperform actively managed funds over the long term.",
    "Starting to invest early is more important than the amount invested.",
    "Dollar-cost averaging reduces the impact of market volatility.",
  ],
  saving: [
    "An emergency fund should cover 3-6 months of essential expenses.",
    "High-yield savings accounts can earn 10-20x more than traditional accounts.",
    "The 24-hour rule helps avoid impulse purchases on non-essential items.",
    "Saving just $5 a day adds up to over $1,800 per year.",
    "Automating savings treats it as a non-negotiable expense.",
  ],
  debt: [
    "The debt avalanche method saves the most money by targeting high-interest debt first.",
    "The debt snowball method builds momentum by paying off smallest debts first.",
    "Negotiating interest rates with creditors can significantly reduce total payments.",
    "Balance transfer cards can provide 0% APR periods for debt consolidation.",
    "Paying more than the minimum accelerates debt payoff exponentially.",
  ],
};

export default function Learn() {
  const [selectedTopic, setSelectedTopic] = useState('budgeting');
  const [facts, setFacts] = useState(sampleFacts.budgeting);

  const handleTopicChange = (topic) => {
    setSelectedTopic(topic);
    setFacts(sampleFacts[topic]);
  };

  const handleRefresh = () => {
    setFacts([...facts].sort(() => Math.random() - 0.5));
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">Learn</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Expand your financial knowledge with AI-curated content</p>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-primary/20">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl gradient-primary flex items-center justify-center shadow-lg shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">Educational Hub</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">AI-generated financial facts and insights</p>
            </div>
          </div>
        </div>

        {/* Topic Selector */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {topics.map((topic) => (
            <Button
              key={topic.id}
              variant={selectedTopic === topic.id ? 'default' : 'outline'}
              size="sm"
              className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
              onClick={() => handleTopicChange(topic.id)}
            >
              <topic.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {topic.label}
            </Button>
          ))}
        </div>

        {/* Facts Grid */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm sm:text-base text-foreground capitalize">{selectedTopic} Facts</h3>
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {facts.map((fact, index) => (
              <div
                key={index}
                className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-5 border border-border shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">{fact}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">Fact #{index + 1}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Daily Tip</h3>
          <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-accent/10 border border-accent/20">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-xs sm:text-sm text-foreground mb-0.5 sm:mb-1">Review Your Subscriptions</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                The average person wastes $200/month on unused subscriptions. Take 5 minutes to audit yours today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
