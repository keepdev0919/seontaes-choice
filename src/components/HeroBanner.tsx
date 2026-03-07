"use client";

import { motion } from "framer-motion";
import { Youtube, Instagram, TrendingUp } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="dark relative overflow-hidden border-b border-[hsl(0,0%,18%)] bg-[hsl(0,0%,5%)] py-8 text-[hsl(50,10%,95%)] md:py-12">
      {/* Decorative elements */}
      <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />

      {/* 모바일: 프로필 왼쪽 + 타이틀만 중앙 */}
      <div className="container relative mx-auto px-4 md:hidden">
        <div className="relative flex items-center py-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute left-0 flex flex-col items-center gap-1.5"
          >
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-primary/50 shadow-lg shadow-primary/20">
              <img
                src="/images/channels4_profile.jpg"
                alt="김선태 프로필"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://www.youtube.com/@kimseontae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-red-400"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/kimseontae_official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-pink-400"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-gradient-gold w-full text-center text-4xl tracking-tight"
          >
            선태의 선택
          </motion.h1>
        </div>
      </div>

      {/* 데스크탑: 프로필 좌상단 절대위치 + 제목 중앙 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute left-10 top-8 z-10 hidden flex-col items-center gap-2 md:flex"
      >
        <div className="h-36 w-36 overflow-hidden rounded-full border-2 border-primary/50 shadow-lg shadow-primary/20">
          <img
            src="/images/channels4_profile.jpg"
            alt="김선태 프로필"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start gap-1">
          <a
            href="https://www.youtube.com/@kimseontae"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-300 transition-colors hover:text-red-400"
          >
            <Youtube className="h-4 w-4" />
            youtube.com/@kimseontae
          </a>
          <a
            href="https://www.instagram.com/kimseontae_official"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-300 transition-colors hover:text-pink-400"
          >
            <Instagram className="h-4 w-4" />
            instagram.com/kimseontae_official
          </a>
        </div>
      </motion.div>

      <div className="container relative mx-auto hidden px-4 md:block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-gradient-gold mb-3 text-6xl tracking-tight lg:text-7xl">
            선태의 선택
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            충주맨 김선태가 선택한{" "}
            <span className="font-bold text-primary">첫 번째 광고주</span>는 누구일까?
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-border" />
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span>실시간 투표 진행중</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
