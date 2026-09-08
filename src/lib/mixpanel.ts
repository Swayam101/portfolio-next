// Mixpanel Analytics Setup
import mixpanel from "mixpanel-browser";

let isInitialized = false;

export const initMixpanel = () => {
  if (typeof window === "undefined" || isInitialized) return;

  try {
    mixpanel.init("c7399c49749641e74790c433edda881f", {
      autocapture: true,
      record_sessions_percent: 100,
      debug: process.env.NODE_ENV === "development",
    });
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize Mixpanel:", error);
  }
};

// Safe Mixpanel track call
export const trackMixpanel = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window === "undefined") return;

  try {
    if (!isInitialized) {
      initMixpanel();
    }
    mixpanel.track(eventName, properties);
  } catch (error) {
    console.error("Mixpanel tracking error:", error);
  }
};

export default mixpanel;
