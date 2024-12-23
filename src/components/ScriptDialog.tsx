import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Script, scriptIcons } from "./ScriptCard";
import { cn } from "@/lib/utils";

interface ScriptDialogProps {
  script: Script | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScriptDialog: React.FC<ScriptDialogProps> = ({ script, open, onOpenChange }) => {
  const handleCopy = () => {
    if (script) {
      navigator.clipboard.writeText(script.code);
      toast.success("Script copied to clipboard!");
    }
  };

  if (!script) return null;

  const Icon = scriptIcons[script.type];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-[#1B2A35] border-primary">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">{script.title}</span>
            </div>
            <Button 
              onClick={handleCopy} 
              className="bg-primary hover:bg-primary/90 text-white gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Script
            </Button>
          </DialogTitle>
          <div className="space-y-4">
            <p className="text-secondary-foreground text-lg">{script.description}</p>
            <div className="flex flex-wrap gap-2">
              {script.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="border-primary/50 text-primary"
                >
                  {tag}
                </Badge>
              ))}
              <Badge 
                className={cn(
                  "ml-auto",
                  script.difficulty === "Easy" && "bg-green-500",
                  script.difficulty === "Medium" && "bg-yellow-500",
                  script.difficulty === "Hard" && "bg-red-500",
                  script.difficulty === "Extreme" && "bg-purple-500",
                )}
              >
                {script.difficulty}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-4">
          <pre className="bg-[#0F1923] p-6 rounded-lg overflow-x-auto border border-primary/20">
            <code className="text-sm text-white font-mono">{script.code}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};