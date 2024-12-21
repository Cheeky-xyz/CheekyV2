import { Script } from "@/components/ScriptCard";
import { basicInteractionScripts } from "./beginner/basic-interactions";
import { gameMechanicsScripts } from "./beginner/game-mechanics";
import { socialFeaturesScripts } from "./beginner/social-features";
import { uiElementsScripts } from "./beginner/ui-elements";

export const beginnerScripts: Script[] = [
  ...basicInteractionScripts,
  ...gameMechanicsScripts,
  ...socialFeaturesScripts,
  ...uiElementsScripts
];