// AgroNex Agentic System - Gemini Function Declarations
// Native schema declarations for @google/genai

import { Type, type FunctionDeclaration } from '@google/genai';

export const AGENT_FUNCTION_DECLARATIONS: FunctionDeclaration[] = [
  {
    name: 'calculate_fertilizer',
    description: 'Calculate official BARC (Bangladesh Agricultural Research Council) fertilizer dosage and split schedule for Boro rice, Aman, Potato, Maize, Tomato, Mustard, or other crops based on land size.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        crop: {
          type: Type.STRING,
          description: 'Crop name, e.g. "Boro Rice", "Potato", "Aman", "Maize", "Tomato", "Mustard"'
        },
        landSize: {
          type: Type.NUMBER,
          description: 'Land size number, e.g. 33, 2, 1.5'
        },
        unit: {
          type: Type.STRING,
          description: 'Unit of land measurement: "decimal" (শতক), "bigha" (বিঘা = ৩৩ শতক), "acre" (একর = ১০০ শতক), or "katha" (কাঠা = ১.৬৫ শতক)'
        }
      },
      required: ['crop', 'landSize']
    }
  },
  {
    name: 'get_regional_market_prices',
    description: 'Query wholesale market benchmark prices for agricultural commodities across major Bangladesh regional trade hubs (Bogura, Rajshahi, Dinajpur, Mymensingh, Dhaka Karwan Bazar).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        commodity: {
          type: Type.STRING,
          description: 'Agricultural commodity name: e.g. "paddy", "rice", "potato", "maize", "goat", "milk", "fish", "rui"'
        },
        district: {
          type: Type.STRING,
          description: 'Optional target district in Bangladesh (e.g. Bogura, Rajshahi, Dinajpur, Mymensingh)'
        }
      },
      required: ['commodity']
    }
  },
  {
    name: 'diagnose_crop_pest_disease',
    description: 'Diagnose crop pests, fungal diseases, viruses, and nutrient deficiencies with certified active chemical ingredients, trade brands, and IPM biological control remedies.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        crop: {
          type: Type.STRING,
          description: 'Name of the crop (e.g. "rice", "potato", "tomato", "brinjal", "maize")'
        },
        symptoms: {
          type: Type.STRING,
          description: 'Observed symptoms or problem description, e.g. "yellow leaves", "neck blast", "late blight water spots", "shoot borer", "whitefly", "pata holud"'
        }
      },
      required: ['crop', 'symptoms']
    }
  },
  {
    name: 'calculate_fisheries_management',
    description: 'Calculate 3-tier polyculture carp stocking density ratios or generate emergency oxygen shortage (DO < 3.0 mg/L) & ammonia mitigation protocol for ponds.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          description: '"stocking_ratio" for 3-layer ecological stocking (Surface 35%, Column 30%, Bottom 35%), or "oxygen_emergency" for early morning gasping fish and chemical aerator dosages'
        },
        pondAreaDecimal: {
          type: Type.NUMBER,
          description: 'Pond water surface area in decimals (শতক)'
        },
        pondDepthFeet: {
          type: Type.NUMBER,
          description: 'Average pond water depth in feet (default: 5-6 feet)'
        }
      },
      required: ['action', 'pondAreaDecimal']
    }
  },
  {
    name: 'calculate_livestock_nutrition_and_fcr',
    description: 'Formulate feed rations, UMS (Urea Molasses Straw) fattening recipes, feed conversion ratio (FCR) targets, and identify acute ruminant/poultry health issues (FMD, Anthrax, Mastitis, PPR).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        animalType: {
          type: Type.STRING,
          description: '"dairy_cow", "beef_cattle", "goat", or "poultry"'
        },
        purpose: {
          type: Type.STRING,
          description: '"milk_production", "fattening", or "general"'
        },
        weightKg: {
          type: Type.NUMBER,
          description: 'Estimated live animal body weight in kilograms'
        },
        milkYieldLiters: {
          type: Type.NUMBER,
          description: 'Daily milk yield in liters (for dairy cows)'
        }
      },
      required: ['animalType']
    }
  },
  {
    name: 'search_verified_experts',
    description: 'Search AgroNex registered and verified BCS Agronomists, DVM Veterinary Surgeons, and BFRI Fisheries Pathologists for consultations.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: {
          type: Type.STRING,
          description: '"veterinary", "agriculturist", or "fisheries"'
        },
        district: {
          type: Type.STRING,
          description: 'Optional district location (e.g. "Bogura", "Mymensingh")'
        }
      }
    }
  },
  {
    name: 'search_marketplace_inventory',
    description: 'Search active farmer listings and inventory in the AgroNex Direct Marketplace for commodities with available quantity, price, and seller contact.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        searchQuery: {
          type: Type.STRING,
          description: 'Search keyword (e.g. "ধান", "আলু", "খাসি", "দুধ", "রুই")'
        },
        sector: {
          type: Type.STRING,
          description: '"agriculture", "livestock", or "fisheries"'
        },
        district: {
          type: Type.STRING,
          description: 'District filter (e.g. "Bogura", "Dinajpur")'
        }
      }
    }
  }
];
