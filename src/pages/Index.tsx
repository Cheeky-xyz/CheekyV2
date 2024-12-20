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
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80")' }}
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
