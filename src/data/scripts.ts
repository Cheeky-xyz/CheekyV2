import { Script } from "@/components/ScriptCard";
import { movementScripts } from "./script-categories/movement";
import { environmentScripts } from "./script-categories/environment";
import { combatScripts } from "./script-categories/combat";
import { uiScripts } from "./script-categories/ui";
import { beginnerScripts } from "./script-categories/beginner";
import { adminScripts } from "./script-categories/admin";
import { dataPersistenceScripts } from "./script-categories/data/data-persistence";
import { advancedCombatScripts } from "./script-categories/combat/advanced-combat";
import { advancedMovementScripts } from "./script-categories/movement/advanced-movement";
import { advancedUtilityScripts } from "./script-categories/utility/advanced-utility";

// Helper function to sort scripts by difficulty
const difficultyOrder = {
  Easy: 0,
  Medium: 1,
  Hard: 2,
  Extreme: 3
};

// Combine all scripts and sort them by difficulty
export const scripts: Script[] = [
  ...beginnerScripts,
  ...adminScripts,
  ...movementScripts,
  ...environmentScripts,
  ...combatScripts,
  ...uiScripts,
  ...dataPersistenceScripts,
  ...advancedCombatScripts,
  ...advancedMovementScripts,
  ...advancedUtilityScripts
].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);