import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Radio, Mic2, Calendar, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Capacitor } from "@capacitor/core";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface NotificationPreferences {
  push_enabled: boolean;
  new_content: boolean;
  live_streams: boolean;
  dj_updates: boolean;
  events: boolean;
}

const defaultPreferences: NotificationPreferences = {
  push_enabled: true,
  new_content: true,
  live_streams: true,
  dj_updates: false,
  events: true,
};

export default function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isNative, setIsNative] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    if (!user) return;
    
    setLoadingPrefs(true);
    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading preferences:", error);
      toast({
        title: "Error",
        description: "Failed to load your preferences.",
        variant: "destructive",
      });
    } else if (data) {
      setPreferences({
        push_enabled: data.push_enabled,
        new_content: data.new_content,
        live_streams: data.live_streams,
        dj_updates: data.dj_updates,
        events: data.events,
      });
    }
    setLoadingPrefs(false);
  };

  const updatePreference = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!user) return;
    
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    setSavingPrefs(true);

    // Upsert the preferences
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({
        user_id: user.id,
        ...newPreferences,
      }, {
        onConflict: "user_id",
      });

    setSavingPrefs(false);

    if (error) {
      console.error("Error saving preferences:", error);
      setPreferences(preferences); // Revert on error
      toast({
        title: "Error",
        description: "Failed to save your preferences.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Preference updated",
        description: "Your notification settings have been saved.",
      });
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  const notificationOptions = [
    {
      key: "new_content" as const,
      icon: Radio,
      title: "New Content",
      description: "Get notified when new videos or mixes are uploaded",
    },
    {
      key: "live_streams" as const,
      icon: Bell,
      title: "Live Streams",
      description: "Be alerted when a DJ goes live",
    },
    {
      key: "dj_updates" as const,
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

  if (authLoading || loadingPrefs) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
      </div>
    );
  }

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
          <p className="text-muted-foreground mb-8">
            Logged in as <span className="font-medium text-foreground">{user?.email}</span>
          </p>

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
                  checked={preferences.push_enabled}
                  onCheckedChange={(checked) => updatePreference("push_enabled", checked)}
                  disabled={!isNative || savingPrefs}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Individual Notification Types */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationOptions.map((option) => {
                const Icon = option.icon;
                const isDisabled = !preferences.push_enabled || savingPrefs;
                
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

          {/* Sign Out */}
          <Card>
            <CardContent className="pt-6">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
