import React, { useState } from "react";
import { ScriptCard, type Script } from "@/components/ScriptCard";
import { ScriptDialog } from "@/components/ScriptDialog";
import { SearchBar } from "@/components/SearchBar";
import { scripts } from "@/data/scripts";
import { Button } from "@/components/ui/button";
import { Download, MessageCircle } from "lucide-react";

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

  const handleDiscordClick = () => {
    window.open("https://discord.gg/hxyBJBZETw", "_blank");
  };

  const handleDownloadClick = () => {
    // Create a text file with all scripts
    const scriptContent = scripts.map(script => (
      `-- ${script.title}\n-- Difficulty: ${script.difficulty}\n-- Tags: ${script.tags.join(", ")}\n\n${script.code}\n\n`
    )).join("\n");

    const blob = new Blob([scriptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roblox-scripts.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-foreground">
      <div 
        className="h-[300px] bg-cover bg-center relative"
        style={{ backgroundImage: 'url("data:image/jpeg;base64,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")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1F2C]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center space-y-4 z-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
              Roblox Script Hub
            </h1>
            <p className="text-secondary-foreground text-lg max-w-2xl mx-auto px-4 animate-fade-in">
              Made By a Roblox Developer for Other Roblox Developers
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Button
                onClick={handleDiscordClick}
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Join Discord
              </Button>
              <Button
                onClick={handleDownloadClick}
                className="bg-primary hover:bg-primary/90 text-white gap-2"
              >
                <Download className="w-4 h-4" />
                Download Scripts
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
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
