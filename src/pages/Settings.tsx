import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Radio, Mic2, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Capacitor } from "@capacitor/core";

interface NotificationPreferences {
  pushEnabled: boolean;
  newContent: boolean;
  liveStreams: boolean;
  djUpdates: boolean;
  events: boolean;
}

const defaultPreferences: NotificationPreferences = {
  pushEnabled: true,
  newContent: true,
  liveStreams: true,
  djUpdates: false,
  events: true,
};

export default function Settings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    
    // Load saved preferences from localStorage
    const saved = localStorage.getItem("notificationPreferences");
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem("notificationPreferences", JSON.stringify(newPreferences));
    
    toast({
      title: "Preference updated",
      description: "Your notification settings have been saved.",
    });
  };

  const notificationOptions = [
    {
      key: "newContent" as const,
      icon: Radio,
      title: "New Content",
      description: "Get notified when new videos or mixes are uploaded",
    },
    {
      key: "liveStreams" as const,
      icon: Bell,
      title: "Live Streams",
      description: "Be alerted when a DJ goes live",
    },
    {
      key: "djUpdates" as const,
      icon: Mic2,
      title: "DJ Updates",
      description: "Receive updates from your favorite DJs",
    },
    {
      key: "events" as const,
      icon: Calendar,
      title: "Events",
      description: "Get notified about upcoming events and shows",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground mb-8">Manage your notification preferences</p>

          {/* Push Notifications Master Toggle */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Push Notifications</CardTitle>
                    <CardDescription>
                      {isNative 
                        ? "Enable or disable all push notifications" 
                        : "Push notifications are only available in the mobile app"}
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={preferences.pushEnabled}
                  onCheckedChange={(checked) => updatePreference("pushEnabled", checked)}
                  disabled={!isNative}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Individual Notification Types */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationOptions.map((option) => {
                const Icon = option.icon;
                const isDisabled = !preferences.pushEnabled;
                
                return (
                  <div 
                    key={option.key}
                    className={`flex items-center justify-between ${isDisabled ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <Label 
                          htmlFor={option.key} 
                          className="text-sm font-medium text-foreground cursor-pointer"
                        >
                          {option.title}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id={option.key}
                      checked={preferences[option.key]}
                      onCheckedChange={(checked) => updatePreference(option.key, checked)}
                      disabled={isDisabled}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setPreferences(defaultPreferences);
                localStorage.setItem("notificationPreferences", JSON.stringify(defaultPreferences));
                toast({
                  title: "Preferences reset",
                  description: "All notification settings have been reset to defaults.",
                });
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
