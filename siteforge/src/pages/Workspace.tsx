import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FileExplorer } from "@/components/FileExplorer";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { Steps } from "@/components/Steps";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BACKEND_URL } from "@/config";
import axios from "axios";
const Workspace = () => {
  const [activeTab, setActiveTab] = useState("code");
  const location = useLocation();
  const { prompt } = location.state || {};
  

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, {
      messages:prompt.trim() 
    })

    
  }
  useEffect(() => {
    init();
  }, [])
  
  return (
    <div className="min-h-screen bg-editor-background text-editor-foreground">
      <div className="flex h-screen">
        <Steps className="w-64 border-r border-white/10" />
        
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="workspace-tabs">
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 p-4">
              {activeTab === "code" ? (
                <div className="flex h-full gap-4">
                  <FileExplorer />
                  <Editor />
                </div>
              ) : (
                <Preview />
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Workspace;