
export interface BuyerPersona {
  ageRange: string;
  gender: string;
  incomeLevel: string;
  summary: string;
}

export interface BudgetRecommendation {
  userBudget: string;
  recommendedRange: string;
  justification: string;
}

export interface Interest {
  name: string;
  reasoning: string;
}

export interface DetailedTargeting {
  interests: Interest[];
  behaviors: string[];
  exclusions: string[];
}

export interface Competitor {
  name: string;
  targetedAudiences: string;
  strategicAdvantage: string;
}

export interface AdCopy {
    headline: string;
    primaryText: string;
}

export interface ExpertRecommendations {
  whyThisWorks: string;
  abTests: string;
  placements: string;
  creatives: string[];
  adCopy: AdCopy;
  cta: string;
}

export interface ReportData {
  productCategory: string;
  buyerPersona: BuyerPersona;
  budgetRecommendation: BudgetRecommendation;
  detailedTargeting: DetailedTargeting;
  copyPasteTargeting: string;
  competitorAnalysis: Competitor[];
  expertRecommendations: ExpertRecommendations;
}
