import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate("/workspace", { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-3xl w-full space-y-8 animate-fadeIn">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Create Your Website</h1>
          <p className="text-lg text-muted-foreground">
            Describe your website and let AI build it for you
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 animate-slideIn">
          <div className="glass-panel p-6 rounded-lg">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your dream website..."
              className="w-full bg-background/50 border-white/10 text-lg p-6"
            />
          </div>
          <Button 
            type="submit"
            className="w-full py-6 text-lg bg-primary hover:bg-primary/90 transition-colors"
            disabled={!prompt.trim()}
          >
            Generate Website
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;