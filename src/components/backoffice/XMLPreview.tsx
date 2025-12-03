import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Copy, Check, Code } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface XMLPreviewProps {
  xml: string;
  onDownload: () => void;
}

export function XMLPreview({ xml, onDownload }: XMLPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    toast.success("XML copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          XML Preview
        </CardTitle>
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" size="sm">
            {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button onClick={onDownload} size="sm">
            <Download className="h-4 w-4 mr-1" /> Download XML
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[500px] text-xs font-mono whitespace-pre-wrap">
          {xml}
        </pre>
      </CardContent>
    </Card>
  );
}
