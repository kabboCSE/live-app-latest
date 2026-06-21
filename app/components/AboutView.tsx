"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Code2,
  Star,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Globe,
  Bug
} from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaEnvelope,
  FaNodeJs,
  FaReact,
  FaPython,
} from "react-icons/fa6";
import { SiMongodb, SiExpress, SiTypescript, SiShopify, SiPostman } from "react-icons/si";
import Link from "next/link";
import BackgroundScene from "./BackgroundScene";
import Header from "./Header";

export default function AboutView() {
  const skills = [
    { name: "MongoDB", icon: SiMongodb, color: "text-green-400" },
    { name: "Express.js", icon: SiExpress, color: "text-gray-300" },
    { name: "React", icon: FaReact, color: "text-cyan-400" },
    { name: "Node.js", icon: FaNodeJs, color: "text-green-500" },
    { name: "TypeScript", icon: SiTypescript, color: "text-blue-400" },
    { name: "Python", icon: FaPython, color: "text-yellow-400" },
    { name: "Shopify", icon: SiShopify, color: "text-emerald-400" },
    { name: "Postman", icon: SiPostman, color: "text-orange-400" },
  ];

  const timeline = [
    {
      year: "2024",
      title: "MSc in Computer Science & Engineering",
      institution: "Jahangirnagar University",
      icon: GraduationCap,
    },
    {
      year: "2022",
      title: "BSc in Computer Science & Engineering",
      institution: "Daffodil International University",
      icon: GraduationCap,
    },
    {
      year: "Present",
      title: "SQA Engineer",
      institution: "Akij iBOS",
      description:
        "Ensuring software quality through testing, validation, and bug identification. Collaborating closely with development teams to deliver high-quality software products.",
      icon: ShieldCheck,
      highlight: true,
    },
  ];

  return (
    <main className="relative min-h-screen text-white overflow-hidden pb-20 sm:pb-24">
      <BackgroundScene />
      <div className="relative z-10">
        <Header />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 sm:mt-16">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-primary/50 bg-white/5 hover:bg-primary/10 text-zinc-300 hover:text-white font-bold text-xs sm:text-sm transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Player</span>
            </Link>
          </motion.div>

          {/* Hero Section with Avatar and Name */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mb-10"
          >
            {/* Large background glow */}
            <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center gap-8 p-8 sm:p-12 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
              {/* Profile Image with animated rings */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-violet-500 to-cyan-400 blur-md opacity-40 scale-110 animate-pulse" />
                <div className="absolute -inset-3 rounded-full border border-primary/20 animate-spin-slow" />
                <div className="absolute -inset-5 rounded-full border border-violet-500/10 animate-spin-slower" />
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                  <Image
                    src="https://i.ibb.co.com/04vzP6z/logo.png"
                    alt="Md. Shahriar Kabbo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-emerald-500 border-4 border-[#070414] z-10 shadow-lg shadow-emerald-500/30" />
              </div>

              {/* Name and Titles */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-violet-500/20 border border-primary/30 text-primary shadow-sm">
                    <Code2 size={12} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      SQA Engineer & MERN Developer
                    </span>
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400">
                      Md. Shahriar
                    </span>{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">
                      Kabbo
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base font-medium text-zinc-400 flex items-center gap-2 justify-center md:justify-start">
                    <MapPin size={14} className="text-primary" />
                    Dhaka, Bangladesh
                  </p>
                </div>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
                  I am currently working as an <strong className="text-white">SQA engineer at Akij iBOS</strong>,
                  where I ensure software quality through testing, validation, and bug identification.
                  I collaborate closely with development teams to deliver high-quality software products.
                </p>

                {/* Quick Connect Buttons */}
                <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                  <a
                    href="https://github.com/kabboCSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-bold text-xs transition-all duration-300 active:scale-95"
                  >
                    <FaGithub size={15} />
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/kabboCSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 hover:border-[#0A66C2]/50 text-zinc-300 hover:text-[#0A66C2] font-bold text-xs transition-all duration-300 active:scale-95"
                  >
                    <FaLinkedin size={15} />
                    LinkedIn
                  </a>
                  <a
                    href="https://www.facebook.com/kabboCSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 hover:border-[#1877F2]/50 text-zinc-300 hover:text-[#1877F2] font-bold text-xs transition-all duration-300 active:scale-95"
                  >
                    <FaFacebook size={15} />
                    Facebook
                  </a>
                  <a
                    href="mailto:kabbo@example.com"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/50 text-zinc-300 hover:text-amber-400 font-bold text-xs transition-all duration-300 active:scale-95"
                  >
                    <FaEnvelope size={15} />
                    Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout: Bio & Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Bio Card - spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Briefcase size={16} className="text-primary" />
                </div>
                <h2 className="text-lg font-bold text-white">About Me</h2>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
                <p>
                  I completed my <strong className="text-white">MSc in Computer Science & Engineering</strong> from{" "}
                  <strong className="text-white">Jahangirnagar University</strong> in 2024 and my{" "}
                  <strong className="text-white">BSc in CSE</strong> from{" "}
                  <strong className="text-white">Daffodil International University</strong> in 2022.
                </p>
                <p>
                  I specialize in the <strong className="text-white">MERN stack</strong> (MongoDB, Express.js, React, Node.js)
                  and have experience in software quality assurance, API testing with Postman,
                  bug tracking, and Shopify development. I am passionate about building reliable,
                  high-performance applications and ensuring top-notch software quality.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <Bug size={12} />
                    SQA Engineering
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
                    <Globe size={12} />
                    MERN Stack
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                    <Code2 size={12} />
                    Shopify Dev
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Skills Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 sm:p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-violet-500/5 blur-[60px] pointer-events-none" />

              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
                  <Code2 size={16} className="text-violet-400" />
                </div>
                <h2 className="text-lg font-bold text-white">Tech Stack</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-300 group cursor-default"
                  >
                    <skill.icon
                      size={18}
                      className={`${skill.color} transition-transform duration-300 group-hover:scale-110`}
                    />
                    <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Timeline / Experience Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm relative overflow-hidden mb-6"
          >
            <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-cyan-500/5 blur-[80px] pointer-events-none" />

            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <GraduationCap size={16} className="text-amber-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Journey</h2>
            </div>

            <div className="space-y-0">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-5 pb-8 last:pb-0">
                  {/* Timeline line */}
                  {index < timeline.length - 1 && (
                    <div className="absolute left-[17px] top-10 bottom-0 w-[1px] bg-gradient-to-b from-primary/40 to-transparent" />
                  )}

                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 mt-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        item.highlight
                          ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10"
                          : "bg-white/5 border-white/10 text-zinc-400"
                      }`}
                    >
                      <item.icon size={16} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest ${
                          item.highlight ? "text-primary" : "text-zinc-500"
                        }`}
                      >
                        {item.year}
                      </span>
                      {item.highlight && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black uppercase tracking-wider text-primary">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{item.title}</h3>
                    <p className="text-sm text-zinc-400 font-medium">{item.institution}</p>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Cards: GitHub Star + Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GitHub Star Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 sm:p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm flex flex-col items-center text-center space-y-5 relative overflow-hidden group"
            >
              <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-primary/5 blur-[60px] pointer-events-none group-hover:bg-primary/10 transition-all duration-700" />

              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 border border-primary/25 text-primary shadow-lg shadow-primary/10">
                <Star size={24} className="animate-pulse" />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-300">
                  Support This Project
                </h3>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-sm">
                  This IPTV player is open-source and free forever. If you find it useful,
                  please give it a star on GitHub to help others discover it!
                </p>
              </div>

              <a
                href="https://github.com/kabboCSE/iptv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:opacity-95 text-white font-extrabold text-sm transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95 cursor-pointer"
              >
                <FaGithub size={16} />
                <span>Star on GitHub</span>
                <ExternalLink size={14} className="opacity-60" />
              </a>
            </motion.div>

            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 sm:p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm flex flex-col items-center text-center space-y-5 relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber-500/5 blur-[60px] pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700" />

              <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 shadow-lg shadow-amber-500/10">
                <Mail size={24} className="animate-bounce" />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-300">
                  Get In Touch
                </h3>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-sm">
                  Have a question, suggestion, or want to collaborate? Feel free to reach out
                  via email or connect on social media.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 w-full justify-center">
                <a
                  href="https://github.com/kabboCSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 min-w-[100px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white font-bold text-xs transition-all duration-300 active:scale-95"
                >
                  <FaGithub size={14} />
                  GitHub
                </a>
                <a
                  href="https://www.facebook.com/kabboCSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 flex-1 min-w-[100px] px-4 py-2.5 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 hover:border-[#1877F2]/50 text-zinc-300 hover:text-[#1877F2] font-bold text-xs transition-all duration-300 active:scale-95"
                >
                  <FaFacebook size={14} />
                  Facebook
                </a>
                <a
                  href="mailto:kabbo@example.com"
                  className="flex items-center justify-center gap-2 flex-1 min-w-[100px] px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/50 text-zinc-300 hover:text-amber-400 font-bold text-xs transition-all duration-300 active:scale-95"
                >
                  <FaEnvelope size={14} />
                  Email
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}