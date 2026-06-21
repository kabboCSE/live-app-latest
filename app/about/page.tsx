import type { Metadata } from "next";
import AboutView from "../components/AboutView";

export const metadata: Metadata = {
  title: "About the Developer — Md. Shahriar Kabbo | IPTV Player",
  description:
    "Learn more about Md. Shahriar Kabbo, an SQA engineer and MERN stack developer behind this premium open-source IPTV web player. Get contact options and official GitHub links.",
  keywords: [
    "Md. Shahriar Kabbo",
    "Shahriar Kabbo",
    "developer",
    "creator",
    "SQA engineer",
    "MERN stack developer",
    "IPTV Web Player support",
    "open source IPTV",
    "kabboCSE",
    "shahriar kabbo github"
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "profile",
    username: "kabboCSE",
    firstName: "Md. Shahriar",
    lastName: "Kabbo",
    url: "/about",
    title: "About the Developer — Md. Shahriar Kabbo",
    description:
      "SQA engineer at Akij iBOS and MERN stack developer behind the premium open-source IPTV web streaming player.",
    images: [
      {
        url: "https://i.ibb.co.com/04vzP6z/logo.png",
        width: 1200,
        height: 630,
        alt: "About Md. Shahriar Kabbo - IPTV Player Developer",
      },
    ],
  },
};

export default function AboutPage() {
  return <AboutView />;
}
