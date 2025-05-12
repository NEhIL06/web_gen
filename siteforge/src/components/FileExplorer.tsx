import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";

interface FileNode {
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
}

const demoFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "components",
        type: "folder",
        children: [
          { name: "Button.tsx", type: "file", content: "// Button component code" },
          { name: "Input.tsx", type: "file", content: "// Input component code" },
        ],
      },
      { name: "App.tsx", type: "file", content: "// App component code" },
      { name: "index.tsx", type: "file", content: "// Entry point code" },
    ],
  },
  {
    name: "public",
    type: "folder",
    children: [
      { name: "index.html", type: "file", content: "<!DOCTYPE html>..." },
      { name: "favicon.ico", type: "file" },
    ],
  },
];

interface FileNodeProps {
  node: FileNode;
  level?: number;
  onSelect: (node: FileNode) => void;
}

const FileNode = ({ node, level = 0, onSelect }: FileNodeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const paddingLeft = `${level * 1.5}rem`;

  const handleClick = () => {
    if (node.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onSelect(node);
    }
  };

  return (
    <div>
      <div
        className="flex items-center py-1 px-2 hover:bg-white/5 cursor-pointer"
        style={{ paddingLeft }}
        onClick={handleClick}
      >
        {node.type === "folder" && (
          <span className="mr-1">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        {node.type === "folder" ? (
          <Folder size={16} className="mr-2" />
        ) : (
          <File size={16} className="mr-2" />
        )}
        <span>{node.name}</span>
      </div>
      {node.type === "folder" && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileNode
              key={index}
              node={child}
              level={level + 1}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer = () => {
  const handleFileSelect = (node: FileNode) => {
    console.log("Selected file:", node);
  };

  return (
    <div className="file-explorer overflow-auto">
      <div className="p-2 font-semibold border-b border-white/10">
        Files
      </div>
      <div className="py-2">
        {demoFiles.map((node, index) => (
          <FileNode key={index} node={node} onSelect={handleFileSelect} />
        ))}
      </div>
    </div>
  );
};