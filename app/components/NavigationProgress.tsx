import { useNavigation } from "react-router";
import { useState, useEffect } from "react";

export function NavigationProgress() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (navigation.state === "loading") {
      setVisible(true);
      return;
    }
    const t = window.setTimeout(() => setVisible(false), 200);
    return () => window.clearTimeout(t);
  }, [navigation.state]);
  if (!visible) return null;
  return <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-brand-green origin-left animate-pulse" aria-hidden />;
}


