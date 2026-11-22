// AgroNex Agentic System - Complete Test & Verification Suite
// Tests all domain tools, calculations, and orchestrator execution.

import {
  toolCalculateFertilizer,
  toolGetRegionalMarketPrices,
  toolDiagnoseCropPestDisease,
  toolCalculateFisheries,
  toolCalculateLivestock,
  toolSearchVerifiedExperts,
  toolSearchMarketplaceInventory,
  executeAgentTool
} from '../api/agent/tools.ts';

function runTestSuite() {
  console.log('\n=============================================================');
  console.log('🌱 AgroNex Agentic Intelligence - Domain Tools Verification');
  console.log('=============================================================\n');

  let passed = 0;
  let total = 0;

  // TEST 1: BARC Fertilizer Calculation (2 Bigha Boro Rice)
  total++;
  console.log('TEST 1: BARC Fertilizer Calculation for 2 Bigha Boro Rice');
  {
    const res = toolCalculateFertilizer({ crop: 'Boro Rice', landSize: 2, unit: 'bigha' });
    // 2 bigha = 66 decimals. Boro urea rate is 1.0 kg/dec => 66 kg urea
    if (res.standardLandDecimals === 66 && res.nutrients.ureaKg === 66 && res.nutrients.tspKg === 29.7) {
      console.log(`  ✅ PASSED: Land=${res.standardLandDecimals} dec, Urea=${res.nutrients.ureaKg}kg, TSP=${res.nutrients.tspKg}kg, Cost=৳${res.estimatedCostBdt}`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Unexpected fertilizer numbers', res);
    }
  }

  // TEST 2: BARC Fertilizer Calculation (Potato in Decimals)
  total++;
  console.log('\nTEST 2: BARC Fertilizer Calculation for Potato (50 decimals)');
  {
    const res = toolCalculateFertilizer({ crop: 'আলু', landSize: 50, unit: 'decimal' });
    // Potato: 1.4 kg urea, 0.9 kg tsp, 1.1 kg mop
    if (res.nutrients.ureaKg === 70 && res.nutrients.tspKg === 45 && res.nutrients.mopKg === 55) {
      console.log(`  ✅ PASSED: Potato 50 dec: Urea=${res.nutrients.ureaKg}kg, TSP=${res.nutrients.tspKg}kg, MoP=${res.nutrients.mopKg}kg`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Potato calculation mismatch', res);
    }
  }

  // TEST 3: Regional Wholesale Market Prices
  total++;
  console.log('\nTEST 3: Regional Wholesale Market Benchmark Retrieval (Potato in Bogura)');
  {
    const res = toolGetRegionalMarketPrices({ commodity: 'potato', district: 'Bogura' });
    if (res.found && res.rates.length > 0 && res.rates[0].wholesalePrice.includes('১,৪২০')) {
      console.log(`  ✅ PASSED: Retrieved wholesale rate for ${res.rates[0].commodity}: ${res.rates[0].wholesalePrice}`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Market price query failed', res);
    }
  }

  // TEST 4: Pest & Disease Diagnostic (Rice Blast)
  total++;
  console.log('\nTEST 4: Disease Diagnosis - Rice Neck Blast');
  {
    const res = toolDiagnoseCropPestDisease({ crop: 'rice', symptoms: 'sheesh shukiye chita, blast lesions' });
    const hasTricyclazole = res.chemicalPrescription.some((p: any) => p.activeIngredient.includes('Tricyclazole'));
    if (res.isEmergency && hasTricyclazole) {
      console.log(`  ✅ PASSED: Correctly identified Blast disease with Tricyclazole active prescription.`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Disease diagnosis mismatch', res);
    }
  }

  // TEST 5: Fisheries Oxygen Emergency
  total++;
  console.log('\nTEST 5: Fisheries Dissolved Oxygen Deficit Emergency Protocol');
  {
    const res = toolCalculateFisheries({ action: 'oxygen_emergency', pondAreaDecimal: 50 });
    if (res.isEmergency && res.immediateEmergencyProtocol.length >= 4) {
      console.log(`  ✅ PASSED: Generated DO Emergency protocol with chemical aerator & zeolite rates.`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Fisheries emergency protocol failed', res);
    }
  }

  // TEST 6: 3-Tier Polyculture Stocking
  total++;
  console.log('\nTEST 6: Fisheries 3-Tier Polyculture Stocking Ratios');
  {
    const res = toolCalculateFisheries({ action: 'stocking_ratio', pondAreaDecimal: 100 });
    const breakdown = res.threeTierStockingBreakdown;
    if (breakdown.surfaceLayer && breakdown.middleColumnLayer && breakdown.bottomLayer) {
      console.log(`  ✅ PASSED: 3-Tier stocking breakdown calculated for 100 dec pond (Total: ${res.totalFingerlingsRecommended} fingerlings).`);
      passed++;
    } else {
      console.error('  ❌ FAILED: 3-tier breakdown missing', res);
    }
  }

  // TEST 7: Livestock UMS Fattening & Nutrition
  total++;
  console.log('\nTEST 7: Livestock Nutrition & Beef Fattening UMS Recipe');
  {
    const res = toolCalculateLivestock({ animalType: 'beef_cattle', weightKg: 350 });
    if (res.umsFormula && res.umsFormula.ingredients.length === 4 && res.targetFcr) {
      console.log(`  ✅ PASSED: UMS recipe generated with Target FCR ${res.targetFcr}.`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Livestock UMS formulation failed', res);
    }
  }

  // TEST 8: Verified Experts Search
  total++;
  console.log('\nTEST 8: Verified Expert Directory Search');
  {
    const res = toolSearchVerifiedExperts({ category: 'veterinary' });
    if (res.count > 0 && res.experts[0].qualification.includes('DVM')) {
      console.log(`  ✅ PASSED: Found ${res.count} verified DVM experts.`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Expert search failed', res);
    }
  }

  // TEST 9: Marketplace Inventory Search
  total++;
  console.log('\nTEST 9: Direct Marketplace Inventory Search');
  {
    const res = toolSearchMarketplaceInventory({ searchQuery: 'ধান' });
    if (res.totalFound > 0 && res.listings[0].product.includes('ধান')) {
      console.log(`  ✅ PASSED: Found ${res.totalFound} active farmer listings.`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Marketplace search failed', res);
    }
  }

  // TEST 10: Master Tool Dispatcher
  total++;
  console.log('\nTEST 10: Master Tool Dispatcher Execution (executeAgentTool)');
  {
    const res = executeAgentTool('calculate_fertilizer', { crop: 'maize', landSize: 1, unit: 'acre' });
    if (res.toolName === 'calculate_fertilizer' && res.result && res.summaryText) {
      console.log(`  ✅ PASSED: Dispatcher correctly executed tool with summary: "${res.summaryText}"`);
      passed++;
    } else {
      console.error('  ❌ FAILED: Master dispatcher failed', res);
    }
  }

  console.log('\n=============================================================');
  console.log(`Verification Complete: ${passed}/${total} Tests Passed`);
  console.log('=============================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite();
