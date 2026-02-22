import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ_BG_IMAGE = "/images/faq-pen-writing.png";

const FAQ_ITEMS = [
  {
    q: "Is my data safe with AI?",
    a: "Yes. Entries are stored encrypted. If you use ‘Analyze,’ that entry is decrypted and sent for that single analysis; we don’t use it for training and we don’t store the decrypted copy / we only process it in a secure environment.",
  },
  {
    q: "How does Jungian analysis work in practice?",
    a: "You write or speak freely; our system looks for recurring symbols, themes, and emotional patterns. We surface connections to Jungian concepts (shadow, persona, archetypes) so you can reflect on them—we don't diagnose, we mirror.",
  },
  {
    q: "Can I use Shadow Journal alongside therapy?",
    a: "Absolutely. Many users treat Shadow Journal as a place to reflect between sessions. It's not a replacement for therapy; it's a tool for self-inquiry. We recommend sharing insights with your therapist if you find that helpful.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "You keep access until the end of your billing period. After that, your data remains stored and you can export it anytime. You can continue with the free tier (The Seeker) and re-subscribe later if you choose.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${FAQ_BG_IMAGE})` }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: [
            `linear-gradient(180deg, rgba(var(--sj-background-dark-rgb), 0.94) 0%, rgba(var(--sj-background-dark-rgb), 0.9) 100%)`,
            `radial-gradient(ellipse 90% 80% at 50% 50%, transparent 20%, rgba(var(--sj-background-dark-rgb), 0.6) 100%)`,
          ].join(", "),
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <h2 className="font-headline mb-2 text-center text-3xl font-bold text-slate-100">
          Common Questions
        </h2>
        <p className="mb-12 text-center text-xs tracking-widest text-slate-500 uppercase">
          Understanding the intersection of technology and the psyche
        </p>
        <ul className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <li
                key={item.q}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-[border-color] duration-300 hover:border-white/20"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-sans font-medium text-slate-100">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-5 w-5 text-slate-500" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-white/10 px-6 pt-2 pb-5 leading-relaxed text-slate-400">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
