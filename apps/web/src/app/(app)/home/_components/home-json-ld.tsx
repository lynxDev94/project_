import { HOME_FAQ_ITEMS } from "./faq-data";

function baseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export function HomeJsonLd() {
  const url = baseUrl();

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${url}/#faq`,
    url,
    mainEntity: HOME_FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const graph = [
    {
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: "Shadow Journal",
      url,
      logo: `${url}/images/brandLogo.png`,
      description:
        "Private journaling with AI reflections inspired by Carl Jung’s analytical psychology—shadow work, archetypes, and recurring patterns (not therapy or diagnosis).",
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      name: "Shadow Journal",
      url,
      publisher: { "@id": `${url}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "WebApplication",
      "@id": `${url}/#webapp`,
      name: "Shadow Journal",
      url,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript. Modern evergreen browser recommended.",
      description:
        "Reflect in private with AI-guided insights inspired by Carl Jung—shadow, persona, archetypes, and the patterns behind your reactions.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Free tier with unlimited journaling; paid plans add AI analysis credits.",
      },
      publisher: { "@id": `${url}/#organization` },
    },
    faqPage,
  ];

  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
