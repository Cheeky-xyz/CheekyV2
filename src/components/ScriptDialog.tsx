import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Script } from "./ScriptCard";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{script.title}</span>
            <Button onClick={handleCopy} variant="outline" size="icon">
              <Copy className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-secondary-foreground">{script.description}</p>
          <div className="flex flex-wrap gap-2">
            {script.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <pre className="bg-secondary p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-white">{script.code}</code>
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};