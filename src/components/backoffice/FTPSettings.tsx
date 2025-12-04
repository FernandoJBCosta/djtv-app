import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

const FTP_SETTINGS_KEY = "backoffice_ftp_settings";

export interface FTPSettings {
  host: string;
  user: string;
  password: string;
  uploadPath: string;
}

const defaultSettings: FTPSettings = {
  host: "",
  user: "",
  password: "",
  uploadPath: "/content/index.xml",
};

interface FTPSettingsEditorProps {
  onSettingsChange?: (settings: FTPSettings) => void;
}

export function FTPSettingsEditor({ onSettingsChange }: FTPSettingsEditorProps) {
  const [settings, setSettings] = useState<FTPSettings>(defaultSettings);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(FTP_SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        onSettingsChange?.(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(FTP_SETTINGS_KEY, JSON.stringify(settings));
    onSettingsChange?.(settings);
    toast.success("FTP settings saved");
  };

  const handleChange = (field: keyof FTPSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>FTP Configuration</CardTitle>
        <CardDescription>
          Configure your FTP server credentials and upload path. These settings are stored locally in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ftp-host">FTP Host</Label>
            <Input
              id="ftp-host"
              placeholder="ftp.example.com"
              value={settings.host}
              onChange={(e) => handleChange("host", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ftp-user">Username</Label>
            <Input
              id="ftp-user"
              placeholder="username"
              value={settings.user}
              onChange={(e) => handleChange("user", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ftp-password">Password</Label>
          <div className="relative">
            <Input
              id="ftp-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={settings.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="upload-path">Upload Path</Label>
          <Input
            id="upload-path"
            placeholder="/content/index.xml"
            value={settings.uploadPath}
            onChange={(e) => handleChange("uploadPath", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Path relative to FTP root (e.g., /content/index.xml)
          </p>
        </div>

        <Button onClick={handleSave} className="w-full md:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save FTP Settings
        </Button>
      </CardContent>
    </Card>
  );
}

export function getFTPSettings(): FTPSettings {
  const saved = localStorage.getItem(FTP_SETTINGS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
}
