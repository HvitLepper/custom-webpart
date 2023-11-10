// TEST
export const PLANNER1_ID = "EDA4Uw1XBk-0lDKLWoxRRWUAAUmD";
export const PLANNER2_ID = "Wcty98J3S0mup6hv4_bfM2UADrjp";

// PROD
export const PROD_PLANNER1_ID = "iS22J9A6zkWA5lxAK4tYO2QAH8H6";
export const PROD_PLANNER2_ID = "TnL8lU43vUKVCe1IXFxq42QAEIc9";

export const PLANNER_IDs = window.location.host.includes('vorrtexx') ? [PLANNER1_ID, PLANNER2_ID] : [PROD_PLANNER1_ID, PROD_PLANNER2_ID];