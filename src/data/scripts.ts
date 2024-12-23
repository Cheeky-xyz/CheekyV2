import { Script } from "@/components/ScriptCard";
import { movementScripts } from "./script-categories/movement";
import { environmentScripts } from "./script-categories/environment";
import { combatScripts } from "./script-categories/combat";
import { uiScripts } from "./script-categories/ui";
import { beginnerScripts } from "./script-categories/beginner";
import { adminScripts } from "./script-categories/admin";

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
  ...uiScripts
].sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);