import React, { useState } from "react";
import { ScriptCard, type Script } from "@/components/ScriptCard";
import { ScriptDialog } from "@/components/ScriptDialog";
import { SearchBar } from "@/components/SearchBar";
import { scripts } from "@/data/scripts";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredScripts = scripts.filter((script) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      script.title.toLowerCase().includes(searchLower) ||
      script.description.toLowerCase().includes(searchLower) ||
      script.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Roblox Script Hub
          </h1>
          <p className="text-secondary-foreground text-lg max-w-2xl mx-auto">
            Discover advanced Roblox scripts for your games. From complex movement systems to
            dynamic weather effects, find the perfect script for your needs.
          </p>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScripts.map((script) => (
            <ScriptCard
              key={script.id}
              script={script}
              onClick={() => {
                setSelectedScript(script);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>

        <ScriptDialog
          script={selectedScript}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </div>
  );
};

export default Index;