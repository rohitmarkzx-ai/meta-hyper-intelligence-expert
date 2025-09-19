
import React, { useState, useEffect, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ReportDisplay } from './components/ReportDisplay';
import { generateStrategy } from './services/geminiService';
import type { ReportData } from './types';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    'Analyzing your product...',
    'Building buyer persona...',
    'Finding best competitors...',
    'Researching audience behaviours...',
    'Cross-referencing market data...',
    'Finalizing expert strategy...',
  ];

  useEffect(() => {
    // FIX: Changed NodeJS.Timeout to ReturnType<typeof setInterval> for browser compatibility.
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      let i = 0;
      setLoadingMessage(loadingMessages[0]);
      interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[i]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerate = useCallback(async (product: string, location: string, budget: string) => {
    setIsLoading(true);
    setError(null);
    setReportData(null);
    try {
      const data = await generateStrategy(product, location, budget);
      setReportData(data);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the report. Please check the console for details and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <LogoIcon />
            <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Meta Ads Expert AI
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Your AI-powered strategist for high-performing Meta Ads campaigns.
          </p>
        </header>

        <main>
          <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <p className="font-semibold">Generation Failed</p>
              <p>{error}</p>
            </div>
          )}
          {isLoading && <LoadingSpinner message={loadingMessage} />}
          {reportData && !isLoading && <ReportDisplay data={reportData} />}
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Meta Ads Expert AI. Powered by Google Gemini.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
