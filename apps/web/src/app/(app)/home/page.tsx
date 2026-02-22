"use client";

import {
  Nav,
  Features,
  Hero,
  Benefits,
  JournalDemo,
  Process,
  Privacy,
  Pricing,
  Story,
  FAQ,
  Footer,
} from "./_components";

export default function Home() {
  return (
    <div className="bg-background-dark fixed inset-0 overflow-y-auto font-sans text-slate-100">
      <Nav />
      <Hero />
      <Benefits />
      <Features />
      <JournalDemo />
      <Process />
      <Privacy />
      <Pricing />
      <Story />
      <FAQ />
      <Footer />
    </div>
  );
}
