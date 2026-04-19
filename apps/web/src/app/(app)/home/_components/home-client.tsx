"use client";

import {
  Nav,
  Features,
  Hero,
  Benefits,
  Process,
  Privacy,
  Pricing,
  Story,
  FAQ,
  Footer,
} from "./index";

export function HomeClient() {
  return (
    <div className="bg-background-dark fixed inset-0 overflow-y-auto font-sans text-slate-100">
      <Nav />
      <Hero />
      <Benefits />
      <Features />
      <Process />
      <Pricing />
      <Privacy />
      <Story />
      <FAQ />
      <Footer />
    </div>
  );
}
