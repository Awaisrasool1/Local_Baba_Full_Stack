import React from "react";
import {
  BusinessPartnerSection,
  Features,
  HeroSection,
  LandingNavBar,
  Slider,
  Testimonial,
  DownloadAppSection,
  Footer,
} from "../../components";

function LandingPage() {
  return (
    <div className="w-full">
      <LandingNavBar />
      <HeroSection />
      <Features />
      <Slider />
      <BusinessPartnerSection />
      <Testimonial />
      <div style={{ justifyContent: "center", display: "flex" }}>
        <DownloadAppSection />
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;
