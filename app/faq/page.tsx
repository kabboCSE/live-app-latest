"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  ChevronDown,
  Tv,
  ListPlus,
  ShieldAlert,
  MessageCircle,
  Globe,
  BookOpen,
} from "lucide-react";

import BackgroundScene from "../components/BackgroundScene";
import Header from "../components/Header";

const faqs = [
  {
    id: "faq-1",
    question: "What exactly is IPTV and how does this player function?",
    answer:
      "IPTV (Internet Protocol Television) is a technology that streams television content through your internet connection instead of relying on traditional cable or satellite signals. Our player is a browser-based application that can play live HLS streams (.m3u8 files) directly. You can browse our built-in channel collection or bring your own playlists into the app.",
    icon: Tv,
  },
  {
    id: "faq-2",
    question: "What is the process for importing my own playlist?",
    answer:
      "To bring in a custom playlist, navigate to the 'Playlists Manager' tab located within the channel listing area. From there you can either provide a direct M3U URL from the web (e.g., hosted on GitHub) or upload a playlist file from your device (supports .m3u, .m3u8, and .json formats). Once imported, the playlist will be saved in your browser and will appear under 'Your Playlists' in the sidebar.",
    icon: ListPlus,
  },
  {
    id: "faq-3",
    question:
      "Why do certain channels fail to start or display a 'Stream Unavailable' message?",
    answer:
      "There are several reasons a live stream might be inaccessible: the source server may be under heavy load, the broadcaster might have changed the stream URL, or the content could be restricted in your region (geo-blocking). When this happens, you can try using the 'Try Reconnecting' option or simply switch to another available channel.",
    icon: ShieldAlert,
  },
  {
    id: "faq-4",
    question: "Do I need to download any additional software or plugins?",
    answer:
      "Not at all! This IPTV player operates entirely within your web browser (Chrome, Safari, Edge, Firefox) on any device including phones, tablets, and desktops. It includes a built-in HLS video player so there is no need for extra extensions, plugins, or software installations.",
    icon: Globe,
  },
  {
    id: "faq-5",
    question: "Is this platform free to use and is it legal?",
    answer:
      "Absolutely, this web player is completely free of charge. We do not host, store, or distribute any media files or streams ourselves. Our default channel list only contains publicly accessible free-to-air (FTA) channels. We strongly advise users to only load playlists that they are legally authorized to access and stream.",
    icon: BookOpen,
  },
  {
    id: "faq-6",
    question: "How can I get support or request new channels to be added?",
    answer:
      "If you have any inquiries, suggestions, or need technical assistance, please reach out to the developer exclusively via Telegram (@KABBO). You can also follow our official GitHub repository to stay informed about updates, bug fixes, and new feature releases.",
    icon: MessageCircle,
  },
];

export default function FAQPage() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden pb-16">
      <BackgroundScene />
      <div className="relative z-10">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
          {/* ─── Page Header ─── */}
          <div className="text-center max-w-3xl mx-auto space-y-5 mb-10 sm:mb-14">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 sm:border-white/5 backdrop-blur-sm"
            >
              <HelpCircle size={14} className="text-primary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
                Help & Knowledgebase
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1]"
            >
              Frequently Asked <span className="gradient-text">Questions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-sm sm:text-base text-gray-400 font-medium max-w-xl mx-auto leading-relaxed"
            >
              Got questions about custom playlists, stream issues, or
              compatibility? Find quick answers and guides below.
            </motion.p>
          </div>

          {/* ─── FAQ List (Accordion style with glassmorphism) ─── */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const IconComponent = faq.icon;
              const isOpen = activeFaq === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="relative overflow-hidden rounded-2xl border border-white/10 sm:border-white/5 bg-white/[0.015] hover:bg-white/[0.04] hover:border-primary/30 backdrop-blur-md transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/10 text-primary flex-shrink-0">
                        <IconComponent size={18} strokeWidth={2} />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-white leading-tight">
                        {faq.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-zinc-400 flex-shrink-0"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-white/5 text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* ─── Support Callout ─── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 p-6 rounded-2xl border border-white/10 sm:border-white/5 bg-white/[0.01] backdrop-blur-sm text-center max-w-xl mx-auto space-y-4"
          >
            <h3 className="text-base sm:text-lg font-bold">
              Still have questions?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium">
              If you could not find your answer here, feel free to reach out for
              direct support. We are active on Telegram.
            </p>
            <div className="pt-2">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-extrabold text-xs sm:text-sm transition-all duration-300 shadow-md shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <MessageCircle size={15} />
                <span>Contact via Telegram</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
