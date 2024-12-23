import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bolt, Shield, Sword, ArrowRight, Cog } from "lucide-react";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Extreme";
export type ScriptType = "movement" | "combat" | "utility" | "power" | "protection";

export interface Script {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  code: string;
  type: ScriptType;
}

interface ScriptCardProps {
  script: Script;
  onClick: () => void;
  className?: string;
}

const difficultyColors = {
  Easy: "bg-green-500",
  Medium: "bg-yellow-500",
  Hard: "bg-red-500",
  Extreme: "bg-purple-500",
};

export const scriptIcons = {
  movement: ArrowRight,
  combat: Sword,
  utility: Cog,
  power: Bolt,
  protection: Shield,
};

export const ScriptCard: React.FC<ScriptCardProps> = ({ script, onClick, className }) => {
  const Icon = scriptIcons[script.type];
  
  return (
    <Card 
      className={cn(
        "group transition-all duration-300 cursor-pointer animate-fade-in border-primary/20 bg-[#1B2A35]",
        "hover:bg-primary/10 hover:border-primary hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1",
        "active:scale-95",
        className
      )}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="text-primary transition-colors duration-300 group-hover:text-primary/80">{script.title}</span>
          </div>
          <Badge 
            className={cn(
              difficultyColors[script.difficulty],
              "text-white transition-transform duration-300 group-hover:scale-105"
            )}
          >
            {script.difficulty}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-secondary-foreground mb-4 transition-colors duration-300 group-hover:text-foreground">{script.description}</p>
        <div className="flex flex-wrap gap-2">
          {script.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline"
              className="border-primary/50 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary/5"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};