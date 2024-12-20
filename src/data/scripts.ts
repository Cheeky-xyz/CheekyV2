import { Script } from "@/components/ScriptCard";
import { movementScripts } from "./script-categories/movement";
import { environmentScripts } from "./script-categories/environment";
import { combatScripts } from "./script-categories/combat";
import { uiScripts } from "./script-categories/ui";

export const scripts: Script[] = [
  ...movementScripts,
  ...environmentScripts,
  ...combatScripts,
  ...uiScripts
];