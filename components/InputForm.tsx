
import React, { useState } from 'react';

interface InputFormProps {
  onGenerate: (product: string, location: string, budget: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading }) => {
  const [product, setProduct] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product.trim() && location.trim() && budget.trim()) {
      onGenerate(product, location, budget);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="flex flex-col">
          <label htmlFor="product" className="mb-2 font-semibold text-gray-300">Product / Service Name</label>
          <input
            id="product"
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="e.g., Luxury Leather Handbags"
            className="bg-gray-900 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="mb-2 font-semibold text-gray-300">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Delhi, India"
            className="bg-gray-900 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="budget" className="mb-2 font-semibold text-gray-300">Your Monthly Budget (INR)</label>
          <input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., 20000"
            className="bg-gray-900 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !product || !location || !budget}
          className="md:col-span-3 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-purple-500/50 transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? 'Generating...' : 'Generate Expert Report'}
        </button>
      </form>
    </div>
  );
};
