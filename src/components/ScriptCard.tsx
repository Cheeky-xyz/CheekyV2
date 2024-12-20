import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Extreme";

export interface Script {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  tags: string[];
  code: string;
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

export const ScriptCard: React.FC<ScriptCardProps> = ({ script, onClick, className }) => {
  return (
    <Card 
      className={cn("hover:bg-card/80 transition-colors cursor-pointer animate-fade-in", className)}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{script.title}</span>
          <Badge className={cn(difficultyColors[script.difficulty], "text-white")}>
            {script.difficulty}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-secondary-foreground mb-4">{script.description}</p>
        <div className="flex flex-wrap gap-2">
          {script.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};