import React, { useState, useRef, useCallback } from 'react';
import type { ReportData } from '../types';
import { 
    CopyIcon, CheckIcon, PdfIcon, CsvIcon, UserCircleIcon, TargetIcon, 
    LightbulbIcon, UsersIcon, CurrencyRupeeIcon, ClipboardIcon, SparklesIcon 
} from './Icons';

interface ReportDisplayProps {
  data: ReportData;
}

const ReportCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string; }> = ({ title, icon, children, className = '' }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden ${className}`}>
        <div className="flex items-center gap-3 bg-gray-900/30 p-4 border-b border-gray-700/50">
            <div className="text-blue-400">{icon}</div>
            <h2 className="text-xl font-bold text-gray-200">{title}</h2>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const Tag: React.FC<{ children: React.ReactNode, color: 'blue' | 'red' }> = ({ children, color }) => {
    const colors = {
        blue: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
        red: 'bg-red-900/50 text-red-300 border-red-700/50'
    }
    return <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${colors[color]}`}>{children}</span>
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ data }) => {
    const [isCopied, setIsCopied] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(data.copyPasteTargeting).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    }, [data.copyPasteTargeting]);

    const handleExportPDF = useCallback(async () => {
        const { jsPDF } = (window as any).jspdf;
        const html2canvas = (window as any).html2canvas;
        const reportElement = reportRef.current;
        if (reportElement) {
            const canvas = await html2canvas(reportElement, { backgroundColor: '#111827', scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('meta-ads-expert-report.pdf');
        }
    }, []);
    
    const handleExportCSV = useCallback(() => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Section,Category,Detail,Reasoning\n";
        csvContent += `Targeting,Age,"${data.buyerPersona.ageRange}",\n`;
        csvContent += `Targeting,Gender,"${data.buyerPersona.gender}",\n`;
        data.detailedTargeting.interests.forEach(i => {
            csvContent += `Targeting,Interest,"${i.name}","${i.reasoning.replace(/"/g, '""')}"\n`;
        });
        data.detailedTargeting.behaviors.forEach(b => { csvContent += `Targeting,Behavior,"${b}",\n`; });
        data.detailedTargeting.exclusions.forEach(e => { csvContent += `Targeting,Exclusion,"${e}",\n`; });
        data.competitorAnalysis.forEach(c => {
            csvContent += `Competitor,"${c.name}","${c.targetedAudiences.replace(/"/g, '""')}","${c.strategicAdvantage.replace(/"/g, '""')}"\n`;
        });
        csvContent += `Recommendations,Placements,"${data.expertRecommendations.placements}",\n`;
        csvContent += `Recommendations,CTA,"${data.expertRecommendations.cta}",\n`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "meta-ads-expert-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [data]);

    return (
        <div className="mt-8 space-y-6">
            <div className="flex justify-end gap-4">
                 <button onClick={handleExportPDF} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500">
                    <PdfIcon /> Export PDF
                </button>
                <button onClick={handleExportCSV} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500">
                    <CsvIcon /> Export CSV
                </button>
            </div>
            <div ref={reportRef} className="space-y-6 p-2">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <ReportCard title="Copy-Paste Targeting" icon={<ClipboardIcon />} className="lg:col-span-3">
                        <div className="bg-gray-900 p-4 rounded-lg relative font-mono text-sm">
                            <pre className="text-gray-300 whitespace-pre-wrap">{data.copyPasteTargeting}</pre>
                            <button onClick={handleCopy} className="absolute top-3 right-3 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition">
                                {isCopied ? <CheckIcon className="h-5 w-5 text-green-400"/> : <CopyIcon className="h-5 w-5 text-gray-300"/>}
                            </button>
                        </div>
                    </ReportCard>
                     <ReportCard title="Budget" icon={<CurrencyRupeeIcon />} className="lg:col-span-2">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Your Monthly Budget</p>
                                <p className="text-2xl font-bold text-gray-200">₹{parseInt(data.budgetRecommendation.userBudget).toLocaleString('en-IN')}</p>
                            </div>
                            <div className="border-t border-gray-700 my-2"></div>
                             <div>
                                <p className="text-sm text-green-400">Expert Recommended Range</p>
                                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-400">{data.budgetRecommendation.recommendedRange}</p>
                            </div>
                            <p className="text-sm text-gray-500 pt-2">{data.budgetRecommendation.justification}</p>
                        </div>
                    </ReportCard>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReportCard title="Ideal Buyer Persona" icon={<UserCircleIcon />}>
                        <div className="space-y-3">
                            <p className="text-gray-300"><strong className="text-gray-100 font-semibold w-20 inline-block">Age:</strong> {data.buyerPersona.ageRange}</p>
                            <p className="text-gray-300"><strong className="text-gray-100 font-semibold w-20 inline-block">Gender:</strong> {data.buyerPersona.gender}</p>
                            <p className="text-gray-300"><strong className="text-gray-100 font-semibold w-20 inline-block">Income:</strong> {data.buyerPersona.incomeLevel}</p>
                            <p className="mt-4 text-gray-400 border-t border-gray-700/50 pt-4">{data.buyerPersona.summary}</p>
                        </div>
                    </ReportCard>
                    <ReportCard title="Strategic Overview" icon={<SparklesIcon />}>
                         <p className="text-gray-400 text-lg leading-relaxed">{data.expertRecommendations.whyThisWorks}</p>
                    </ReportCard>
                </div>

                <ReportCard title="Detailed Targeting Breakdown" icon={<TargetIcon />}>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg text-blue-300 mb-3">Interests</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.detailedTargeting.interests.map(interest => (
                                    <div key={interest.name} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
                                        <p className="font-medium text-gray-200">{interest.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{interest.reasoning}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <h3 className="font-semibold text-lg text-blue-300 mb-3">Behaviors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {data.detailedTargeting.behaviors.map(b => <Tag key={b} color="blue">{b}</Tag>)}
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold text-lg text-red-300 mb-3">Exclusions</h3>
                                 <div className="flex flex-wrap gap-2">
                                    {data.detailedTargeting.exclusions.map(e => <Tag key={e} color="red">{e}</Tag>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </ReportCard>

                 <ReportCard title="Competitor Analysis" icon={<UsersIcon />}>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.competitorAnalysis.map(comp => (
                            <div key={comp.name} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 h-full flex flex-col justify-between">
                               <div>
                                    <h3 className="font-bold text-lg text-gray-200">{comp.name}</h3>
                                    <p className="text-sm text-gray-400 mt-2"><strong className="text-gray-300 font-medium">Likely Audience:</strong> {comp.targetedAudiences}</p>
                               </div>
                                <p className="text-sm text-green-400 mt-3 bg-green-900/20 p-2 rounded-md border border-green-700/30"><strong className="text-green-300 font-semibold">Your Advantage →</strong> {comp.strategicAdvantage}</p>
                            </div>
                        ))}
                     </div>
                </ReportCard>

                <ReportCard title="Expert Recommendations" icon={<LightbulbIcon />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                             <div>
                                 <h3 className="font-semibold text-lg text-blue-300 mb-2">A/B Testing Suggestion</h3>
                                 <p className="text-gray-400">{data.expertRecommendations.abTests}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-blue-300 mb-2">Ad Placements</h3>
                                <p className="text-gray-300">{data.expertRecommendations.placements}</p>
                            </div>
                            <div>
                                 <h3 className="font-semibold text-lg text-blue-300 mb-2">Creative Ideas</h3>
                                 <ul className="space-y-2 list-disc list-inside text-gray-400">
                                    {data.expertRecommendations.creatives.map((c, i) => <li key={i}><span className="text-gray-300">{c}</span></li>)}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
                            <h3 className="font-semibold text-lg text-center text-blue-300 mb-4">Ad Copy Preview</h3>
                            <div className="bg-gray-800 rounded-lg p-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full"></div>
                                    <span className="font-bold text-sm text-gray-200">Your Brand</span>
                                </div>
                                <p className="text-sm text-gray-300 my-3">{data.expertRecommendations.adCopy.primaryText}</p>
                            </div>
                            <div className="bg-gray-700 mt-1 p-3 rounded-b-lg">
                                <p className="text-xs text-gray-400 uppercase">yourbrand.com</p>
                                <div className="flex justify-between items-center">
                                    <h4 className="font-bold text-gray-200">{data.expertRecommendations.adCopy.headline}</h4>
                                    <span className="bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded-md">{data.expertRecommendations.cta}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ReportCard>
            </div>
        </div>
    );
};