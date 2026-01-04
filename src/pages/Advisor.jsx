import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Brain, Shield, TrendingUp, Sparkles, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Add your Gemini API key here
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

async function run(prompt) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}

export default function Advisor() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    const prompt = "Analyze my financial data and provide personalized advice.";
    const result = await run(prompt);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">AI Financial Advisor</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Get personalized financial guidance powered by AI</p>
        </div>

        {/* Hero Card */}
        <div className="gradient-hero rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-primary/20">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl gradient-primary flex items-center justify-center shadow-lg animate-bounce-subtle shrink-0">
              <Brain className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary-foreground" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-1 sm:mb-2">Your Personal Finance AI</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Get real-time spending analysis, budget guardrails, and strategic financial advice tailored to your goals.
              </p>
            </div>
            <Button
              size="default"
              className="gap-2 w-full sm:w-auto"
              onClick={handleAnalysis}
              disabled={isAnalyzing}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">{isAnalyzing ? 'Analyzing...' : 'Analyze Finances'}</span>
            </Button>
          </div>
        </div>

        {analysis && (
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
            <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">{analysis}</p>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Guardrail Feature */}
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-sm">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground">Budget Guardrail</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Pre-transaction safety check</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Before making a purchase, let AI analyze if it fits your budget and spending patterns.
            </p>

            {/* Sample Response */}
            {/* <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-foreground">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success shrink-0" />
                <span className="truncate">Last Check: $45 for Groceries</span>
              </div>
              <p className="text-xs sm:text-sm text-success">
                ✓ SAFE: This expense is within your weekly grocery budget.
              </p>
            </div> */}

            <Button variant="outline" className="w-full mt-3 sm:mt-4 gap-2 text-xs sm:text-sm">
              Check a Transaction <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>

          {/* Strategic Advisor */}
          <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border shadow-sm">
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-foreground">Strategic Advisor</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Long-term financial planning</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Get a comprehensive financial plan based on your 6-month spending history and goals.
            </p>

            {/* Sample Response */}
            {/* <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm font-medium text-foreground">Key Insight:</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Your dining expenses increased 23% last month. Consider meal prepping to save ~$150/month.
              </p>
            </div> */}

            <Button variant="outline" className="w-full mt-3 sm:mt-4 gap-2 text-xs sm:text-sm">
              Get Full Analysis <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>

        {/* AI Status */}
        {/* <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
          <h3 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">Recent AI Insights</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg sm:rounded-xl bg-success/5 border border-success/20">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-xs sm:text-sm text-foreground">On Track for Savings Goal</p>
                <p className="text-xs sm:text-sm text-muted-foreground">You're 15% ahead of schedule for your $5,000 emergency fund goal.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 p-3 rounded-lg sm:rounded-xl bg-warning/5 border border-warning/20">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-warning mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-xs sm:text-sm text-foreground">Entertainment Spending Alert</p>
                <p className="text-xs sm:text-sm text-muted-foreground">You've used 80% of your monthly entertainment budget with 10 days remaining.</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </AppLayout>
  );
}