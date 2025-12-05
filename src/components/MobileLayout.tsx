import { ReactNode } from "react";
import { Capacitor } from "@capacitor/core";
import { BottomNav } from "./BottomNav";

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const isNativeApp = Capacitor.isNativePlatform();

  return (
    <>
      {children}
      {isNativeApp && <BottomNav />}
    </>
  );
}
