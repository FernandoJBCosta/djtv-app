import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, Share, Plus, MoreVertical, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    setIsAndroid(/android/.test(userAgent));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for successful install
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <img 
              src="/app-icon.png" 
              alt="DJTV" 
              className="w-32 h-32 mx-auto mb-6 rounded-2xl shadow-lg shadow-primary/20"
            />
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Install DJTV App</h1>
            <p className="text-muted-foreground text-lg">
              Get the full app experience with offline access, faster loading, and instant access from your home screen.
            </p>
          </div>

          {/* Already Installed */}
          {isInstalled && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">App Already Installed!</h2>
              <p className="text-muted-foreground">
                DJTV is installed on your device. Open it from your home screen for the best experience.
              </p>
            </div>
          )}

          {/* Install Button for supported browsers */}
          {deferredPrompt && !isInstalled && (
            <div className="mb-12">
              <Button
                size="lg"
                onClick={handleInstallClick}
                className="gap-2 text-lg px-8 py-6"
              >
                <Download className="w-5 h-5" />
                Install DJTV
              </Button>
            </div>
          )}

          {/* Platform-specific instructions */}
          {!isInstalled && (
            <div className="space-y-8">
              {/* iOS Instructions */}
              {isIOS && (
                <div className="bg-card border border-border rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Install on iPhone/iPad</h2>
                  </div>
                  <ol className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">1</span>
                      <span>Tap the <Share className="w-4 h-4 inline mx-1" /> Share button in Safari</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">2</span>
                      <span>Scroll down and tap <Plus className="w-4 h-4 inline mx-1" /> "Add to Home Screen"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">3</span>
                      <span>Tap "Add" in the top right corner</span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Android Instructions */}
              {isAndroid && !deferredPrompt && (
                <div className="bg-card border border-border rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Install on Android</h2>
                  </div>
                  <ol className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">1</span>
                      <span>Tap the <MoreVertical className="w-4 h-4 inline mx-1" /> menu button in Chrome</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">2</span>
                      <span>Tap "Install app" or "Add to Home screen"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">3</span>
                      <span>Tap "Install" to confirm</span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Desktop Instructions */}
              {!isIOS && !isAndroid && !deferredPrompt && (
                <div className="bg-card border border-border rounded-xl p-6 text-left">
                  <div className="flex items-center gap-3 mb-4">
                    <Monitor className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-semibold">Install on Desktop</h2>
                  </div>
                  <ol className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">1</span>
                      <span>Look for the install icon in the address bar (Chrome/Edge)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">2</span>
                      <span>Or click the menu and select "Install DJTV"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-sm flex items-center justify-center font-medium">3</span>
                      <span>Click "Install" to add to your desktop</span>
                    </li>
                  </ol>
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                <div className="bg-card/50 border border-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">⚡ Faster Loading</h3>
                  <p className="text-sm text-muted-foreground">App loads instantly from your device</p>
                </div>
                <div className="bg-card/50 border border-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">📱 Home Screen</h3>
                  <p className="text-sm text-muted-foreground">Quick access just like a native app</p>
                </div>
                <div className="bg-card/50 border border-border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🔄 Auto Updates</h3>
                  <p className="text-sm text-muted-foreground">Always get the latest features</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}