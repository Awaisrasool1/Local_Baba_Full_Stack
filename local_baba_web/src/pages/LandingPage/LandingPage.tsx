import React from "react";
import { Features, HeroSection, LandingNavBar } from "../../components";

function LandingPage() {
  return (
    <div className="w-full">
      <LandingNavBar />
      <HeroSection />
      <Features />
    </div>
  );
}

export default LandingPage;
