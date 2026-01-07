/**
 * Deck Type Color Calculator
 * Determines Attack/Defense/Stamina/Balance from combo parts
 *
 * Usage: calculateDeckType("SharkEdge 3-60 Flat") => "attack"
 */

// Parts database with ATK/DEF/STA stats
// Values from Dustin's Parts.csv integration
const PARTS_STATS = {
  // === BLADES ===
  // Attack-oriented
  'SharkEdge': { atk: 65, def: 15, sta: 20 },
  'DranBuster': { atk: 55, def: 25, sta: 20 },
  'ImpactDrake': { atk: 75, def: 10, sta: 15 },
  'LeonClaw': { atk: 50, def: 30, sta: 20 },
  'KnightShield': { atk: 45, def: 35, sta: 20 },
  'RhinoHorn': { atk: 60, def: 25, sta: 15 },
  'CobaltDrake': { atk: 55, def: 20, sta: 25 },
  'PhoenixWing': { atk: 50, def: 20, sta: 30 },
  'TyrannoRoar': { atk: 70, def: 15, sta: 15 },
  'ValkyrieWing': { atk: 55, def: 25, sta: 20 },
  'KnightMail': { atk: 40, def: 40, sta: 20 },
  'SilverWolf': { atk: 50, def: 25, sta: 25 },

  // Defense-oriented
  'ShieldDrake': { atk: 20, def: 60, sta: 20 },
  'RoarTyranno': { atk: 30, def: 50, sta: 20 },
  'HeliosArmor': { atk: 25, def: 55, sta: 20 },
  'UnicornSting': { atk: 35, def: 45, sta: 20 },

  // Stamina-oriented
  'WizardRod': { atk: 25, def: 25, sta: 50 },
  'HoverWyvern': { atk: 30, def: 20, sta: 50 },
  'FoxBrush': { atk: 20, def: 30, sta: 50 },
  'DragonSword': { atk: 35, def: 25, sta: 40 },
  'KnightLance': { atk: 30, def: 30, sta: 40 },
  'PegasusWing': { atk: 25, def: 30, sta: 45 },
  'HellsScythe': { atk: 35, def: 20, sta: 45 },

  // Balance-oriented
  'WyvernGale': { atk: 35, def: 30, sta: 35 },
  'PhoenixFeather': { atk: 35, def: 35, sta: 30 },
  'DragonArmor': { atk: 35, def: 35, sta: 30 },

  // === RATCHETS ===
  // Higher number = more stamina/defense, lower = more attack
  '1-60': { atk: 50, def: 20, sta: 30 },
  '2-60': { atk: 45, def: 25, sta: 30 },
  '3-60': { atk: 40, def: 30, sta: 30 },
  '3-70': { atk: 35, def: 35, sta: 30 },
  '3-80': { atk: 30, def: 40, sta: 30 },
  '4-60': { atk: 35, def: 30, sta: 35 },
  '4-70': { atk: 30, def: 35, sta: 35 },
  '4-80': { atk: 25, def: 40, sta: 35 },
  '5-60': { atk: 30, def: 35, sta: 35 },
  '5-70': { atk: 25, def: 40, sta: 35 },
  '5-80': { atk: 20, def: 45, sta: 35 },
  '6-60': { atk: 25, def: 35, sta: 40 },
  '6-70': { atk: 20, def: 40, sta: 40 },
  '6-80': { atk: 15, def: 45, sta: 40 },
  '9-60': { atk: 20, def: 40, sta: 40 },
  '9-70': { atk: 15, def: 45, sta: 40 },
  '9-80': { atk: 10, def: 50, sta: 40 },

  // === BITS ===
  // Attack bits (aggressive movement)
  'Flat': { atk: 55, def: 15, sta: 30 },
  'Rush': { atk: 50, def: 20, sta: 30 },
  'Accel': { atk: 45, def: 25, sta: 30 },
  'Taper': { atk: 50, def: 15, sta: 35 },
  'Point': { atk: 55, def: 10, sta: 35 },
  'Xtreme': { atk: 60, def: 10, sta: 30 },
  'Quick': { atk: 45, def: 20, sta: 35 },

  // Defense bits (stability)
  'Orb': { atk: 20, def: 50, sta: 30 },
  'Needle': { atk: 25, def: 45, sta: 30 },
  'Spike': { atk: 30, def: 45, sta: 25 },
  'Metal Needle': { atk: 20, def: 55, sta: 25 },
  'Low Flat': { atk: 40, def: 35, sta: 25 },

  // Stamina bits (spin time)
  'Ball': { atk: 15, def: 30, sta: 55 },
  'High Needle': { atk: 20, def: 35, sta: 45 },
  'Gear Ball': { atk: 20, def: 30, sta: 50 },
  'Unite': { atk: 25, def: 30, sta: 45 },
  'Free Ball': { atk: 20, def: 25, sta: 55 },
  'Disk Ball': { atk: 20, def: 35, sta: 45 },

  // Balance bits
  'Hexa': { atk: 35, def: 30, sta: 35 },
  'Dot': { atk: 30, def: 35, sta: 35 },
  'Cycle': { atk: 35, def: 35, sta: 30 },
};

/**
 * Parse a combo string into its component parts
 * @param {string} combo - e.g. "SharkEdge 3-60 Flat"
 * @returns {string[]} - Array of part names
 */
function parseCombo(combo) {
  if (!combo || typeof combo !== 'string') return [];

  // Split by spaces and filter empty strings
  const parts = combo.trim().split(/\s+/).filter(Boolean);

  // Handle multi-word parts like "Metal Needle" or "Low Flat"
  const normalized = [];
  for (let i = 0; i < parts.length; i++) {
    const current = parts[i];
    const next = parts[i + 1];

    // Check if this + next forms a known multi-word part
    if (next) {
      const combined = `${current} ${next}`;
      if (PARTS_STATS[combined]) {
        normalized.push(combined);
        i++; // Skip next part
        continue;
      }
    }

    normalized.push(current);
  }

  return normalized;
}

/**
 * Calculate the dominant deck type from a combo string
 * @param {string} combo - e.g. "SharkEdge 3-60 Flat"
 * @returns {string} - "attack", "defense", "stamina", or "balance"
 */
function calculateDeckType(combo) {
  const parts = parseCombo(combo);

  let totalAtk = 0;
  let totalDef = 0;
  let totalSta = 0;
  let partCount = 0;

  for (const part of parts) {
    const stats = PARTS_STATS[part];
    if (stats) {
      totalAtk += stats.atk;
      totalDef += stats.def;
      totalSta += stats.sta;
      partCount++;
    }
  }

  // If no known parts found, return balance as default
  if (partCount === 0) return 'balance';

  // Determine dominant type
  const max = Math.max(totalAtk, totalDef, totalSta);

  // Check for ties (balance)
  const stats = [totalAtk, totalDef, totalSta];
  const maxCount = stats.filter(s => s === max).length;

  if (maxCount > 1) {
    return 'balance';
  }

  if (max === totalAtk) return 'attack';
  if (max === totalDef) return 'defense';
  if (max === totalSta) return 'stamina';

  return 'balance';
}

/**
 * Get the color for a deck type
 * @param {string} type - "attack", "defense", "stamina", or "balance"
 * @returns {string} - Hex color code
 */
function getDeckTypeColor(type) {
  const colors = {
    attack: '#2196F3',   // Blue
    defense: '#4CAF50',  // Green
    stamina: '#FBC02D',  // Yellow
    balance: '#F44336',  // Red
  };
  return colors[type] || colors.balance;
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateDeckType, getDeckTypeColor, parseCombo, PARTS_STATS };
}
