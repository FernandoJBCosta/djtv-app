import { Header } from "@/components/Header";
import { ChevronRight, Info, Shield, FileText, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { MobileLayout } from "@/components/MobileLayout";
import djtvLogo from "@/assets/djtv-logo.png";

const APP_VERSION = "2.0";
const BUILD_NUMBER = "1";

export default function Settings() {
  return (
    <MobileLayout>
      <div className="min-h-screen bg-background pb-24">
        <Header />

        <main className="pt-24 md:pt-28 px-4 md:px-8 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

          {/* About Section */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">About</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Version</span>
                </div>
                <span className="text-muted-foreground">
                  {APP_VERSION} ({BUILD_NUMBER})
                </span>
              </div>

              <a
                href="https://djtv.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Website</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>

              <a
                href="mailto:hello@djtv.pt"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Contact Us</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </section>

          {/* Legal Section */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Legal</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <a
                href="https://djtv.pt/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Privacy Policy</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>

              <a
                href="https://djtv.pt/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Terms of Service</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </section>

          {/* Social Media Section */}
          <section className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Follow Us</h2>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <a
                href="https://www.instagram.com/djtv_pt/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Instagram</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>

              <a
                href="https://facebook.com/djtv.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 border-b border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-primary" />
                  <span className="text-foreground">Facebook</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </a>
            </div>
          </section>

          {/* App Info */}
          <div className="text-center text-muted-foreground text-sm mt-12">
            <img src={djtvLogo} alt="DJTV Logo" className="h-12 mx-auto mb-3" />
            <p className="mt-1">© {new Date().getFullYear()} DJTV. All rights reserved.</p>
          </div>
        </main>
      </div>
    </MobileLayout>
  );
}
