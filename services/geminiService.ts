
import { GoogleGenAI, Type } from "@google/genai";
import type { ReportData } from '../types';

const reportSchema = {
    type: Type.OBJECT,
    properties: {
        productCategory: { 
            type: Type.STRING,
            description: "The most accurate category/niche for the product."
        },
        buyerPersona: {
            type: Type.OBJECT,
            properties: {
                ageRange: { type: Type.STRING, description: "A specific age range (e.g., '25-45')." },
                gender: { type: Type.STRING, description: "'Male', 'Female', or 'All'." },
                incomeLevel: { type: Type.STRING, description: "A descriptive level (e.g., 'Middle to Upper-Middle Class')." },
                summary: { type: Type.STRING, description: "A brief paragraph describing the persona's lifestyle, pain points, and motivations." },
            },
            required: ['ageRange', 'gender', 'incomeLevel', 'summary']
        },
        budgetRecommendation: {
            type: Type.OBJECT,
            properties: {
                userBudget: { type: Type.STRING, description: "The user's provided budget." },
                recommendedRange: { type: Type.STRING, description: "A realistic monthly budget range in INR (e.g., '₹15,000 - ₹25,000')." },
                justification: { type: Type.STRING, description: "Briefly explain why this budget is recommended." },
            },
            required: ['userBudget', 'recommendedRange', 'justification']
        },
        detailedTargeting: {
            type: Type.OBJECT,
            properties: {
                interests: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The specific interest term for Meta Ads." },
                            reasoning: { type: Type.STRING, description: "Expert explanation of why this interest is relevant." },
                        },
                        required: ['name', 'reasoning']
                    }
                },
                behaviors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Purchase-intent focused behaviors." },
                exclusions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Audiences to exclude." },
            },
            required: ['interests', 'behaviors', 'exclusions']
        },
        copyPasteTargeting: { 
            type: Type.STRING,
            description: "A single multi-line string formatted for easy copy-pasting. Must include Age, Gender, Location, Interests, Behaviors, and Exclusions."
        },
        competitorAnalysis: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "A plausible competitor name." },
                    targetedAudiences: { type: Type.STRING, description: "Description of audiences they likely target." },
                    strategicAdvantage: { type: Type.STRING, description: "How the user can outperform this competitor." },
                },
                required: ['name', 'targetedAudiences', 'strategicAdvantage']
            }
        },
        expertRecommendations: {
            type: Type.OBJECT,
            properties: {
                whyThisWorks: { type: Type.STRING, description: "Concise explanation of why the targeting strategy is effective." },
                abTests: { type: Type.STRING, description: "Suggest two distinct audiences (Audience A and Audience B) for A/B testing." },
                placements: { type: Type.STRING, description: "Recommended ad placements (e.g., 'Facebook Feed, Instagram Stories, Reels')." },
                creatives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 specific, actionable ideas for ad creatives." },
                adCopy: { 
                    type: Type.OBJECT,
                    properties: {
                        headline: { type: Type.STRING, description: "A compelling, short ad copy headline." },
                        primaryText: { type: Type.STRING, description: "A compelling primary text for the ad." },
                    },
                    required: ['headline', 'primaryText']
                 },
                cta: { type: Type.STRING, description: "The most effective Call-To-Action button text." },
            },
            required: ['whyThisWorks', 'abTests', 'placements', 'creatives', 'adCopy', 'cta']
        }
    },
    required: ['productCategory', 'buyerPersona', 'budgetRecommendation', 'detailedTargeting', 'copyPasteTargeting', 'competitorAnalysis', 'expertRecommendations']
};

// FIX: Corrected the prompt string to remove invalid template literal syntax (`${...}`).
// The instructions for the AI should contain plain text for property names, formatted as code with backticks, not as interpolated variables.
// This resolves numerous "Cannot find name" and "is not callable" errors.
const buildPrompt = (product: string, location: string, budget: string): string => {
  return `
You are a world-class Meta Ads strategist with over 20 years of experience, possessing the analytical prowess of a supercomputer. Your task is to generate a complete and high-performing Meta Ads campaign strategy based on the user's input.

The user provides:
- Product/Service: "${product}"
- Location: "${location}"
- Their Monthly Budget: "${budget} INR"

Your output MUST be a single, valid JSON object following the provided schema. Do not include any text, markdown formatting, or explanations outside of the JSON structure.

Here are your instructions for each section of the JSON output:

1.  **productCategory**: Analyze the product/service and determine its most accurate category or niche.

2.  **buyerPersona**: Create a detailed buyer persona for the ideal customer.
    *   \`ageRange\`: A specific age range (e.g., "25-45").
    *   \`gender\`: "Male", "Female", or "All".
    *   \`incomeLevel\`: A descriptive level (e.g., "Middle to Upper-Middle Class").
    *   \`summary\`: A brief paragraph describing the persona's lifestyle, pain points, and motivations related to the product.

3.  **budgetRecommendation**:
    *   \`userBudget\`: The user's provided budget.
    *   \`recommendedRange\`: Based on the product, location, and your expertise, provide a realistic and effective monthly budget range in INR (e.g., "₹15,000 - ₹25,000").
    *   \`justification\`: Briefly explain why this budget is recommended.

4.  **detailedTargeting**:
    *   \`interests\`: An array of 5-7 objects. For each object:
        *   \`name\`: The specific interest targeting term for Meta Ads Manager.
        *   \`reasoning\`: A short, expert explanation of why this interest is relevant.
    *   \`behaviors\`: An array of 3-5 strings. Include ONLY purchase-intent focused behaviors like 'Engaged Shoppers', 'Online Buyers', 'Small Business Owners', 'Facebook page admins'.
    *   \`exclusions\`: An array of 2-3 strings for audiences to exclude (e.g., 'Job seekers', 'Students', if irrelevant).

5.  **copyPasteTargeting**:
    *   A single multi-line string formatted for easy copy-pasting into Meta Ads Manager. It must include Age, Gender, Location (with a suggested radius), Interests (comma-separated), Behaviors (comma-separated), and Exclusions (comma-separated). Use the generated persona age/gender.

6.  **competitorAnalysis**:
    *   Based on your vast knowledge of the digital advertising landscape, simulate an analysis of 2-3 likely top competitors for this product in the specified location.
    *   For each competitor:
        *   \`name\`: A plausible competitor name.
        *   \`targetedAudiences\`: A brief description of the audiences they likely target.
        *   \`strategicAdvantage\`: A suggestion on how the user can outperform this competitor's strategy.

7.  **expertRecommendations**:
    *   \`whyThisWorks\`: A concise explanation of why the overall targeting strategy is effective.
    *   \`abTests\`: Suggest two distinct audiences (Audience A and Audience B) for A/B testing in a single string.
    *   \`placements\`: Recommend the best ad placements (e.g., "Facebook Feed, Instagram Stories, Reels").
    *   \`creatives\`: Provide 2-3 specific and actionable ideas for ad creatives as an array of strings.
    *   \`adCopy\`: Write a compelling, short ad copy headline and primary text.
    *   \`cta\`: Suggest the most effective Call-To-Action button text (e.g., "Shop Now", "Learn More").
`;
};


export const generateStrategy = async (product: string, location: string, budget: string): Promise<ReportData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(product, location, budget);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: reportSchema,
    },
  });

  const rawJson = response.text.trim();
  try {
    const parsedData = JSON.parse(rawJson);
    return parsedData as ReportData;
  } catch (e) {
    console.error("Failed to parse Gemini response:", rawJson);
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
};
