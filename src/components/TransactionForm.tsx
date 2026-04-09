import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send, FileText } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (logs: string) => void;
  isLoading: boolean;
}

const SAMPLE_LOGS = `Transaction Logs for User A over 7 days:
- Received 5,000 from Customer X
- Paid 500 for electricity
- Received 3,000 from Customer Y
- Transferred 2,000 to Family
- Received 6,000 from Customer Z
- Paid 1,000 for vendor supplies
- Received 4,500 from Customer W
- Paid 300 for water bill
- Received 5,200 from Customer V`;

export function TransactionForm({ onSubmit, isLoading }: TransactionFormProps) {
  const [logs, setLogs] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logs.trim()) {
      onSubmit(logs);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-xl bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Analyze Transactions</CardTitle>
        <CardDescription>
          Paste raw mobile money logs or SMS receipts below to generate a financial profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Paste transaction logs here..."
              className="min-h-[200px] font-mono text-sm resize-none bg-white/80 border-slate-200 focus:ring-primary/20"
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 text-xs text-muted-foreground hover:text-primary"
              onClick={() => setLogs(SAMPLE_LOGS)}
            >
              <FileText className="w-3 h-3 mr-1" />
              Use Sample Data
            </Button>
          </div>
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.01] active:scale-[0.99]"
            disabled={isLoading || !logs.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing with Gemini...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Generate Trust Score
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
