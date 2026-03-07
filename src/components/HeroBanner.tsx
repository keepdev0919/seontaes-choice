import { motion } from "framer-motion";
import { Youtube, Instagram, TrendingUp } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="dark relative overflow-hidden border-b border-[hsl(0,0%,18%)] bg-[hsl(0,0%,5%)] py-8 text-[hsl(50,10%,95%)] md:py-12">
      {/* Decorative elements */}
      <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />

      {/* 김선태 프로필 사진 + SNS 링크 — 좌상단 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute left-6 top-6 z-10 flex flex-col items-center gap-2 md:left-10 md:top-8"
      >
        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-primary/50 shadow-lg shadow-primary/20 md:h-36 md:w-36">
          <img
            src="/images/channels4_profile.jpg"
            alt="김선태 프로필"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <a
            href="https://www.youtube.com/@kimseontae"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground transition-colors hover:text-red-500 md:text-xs"
          >
            youtube.com/@kimseontae
          </a>
          <a
            href="https://www.instagram.com/kimseontae_official"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground transition-colors hover:text-pink-500 md:text-xs"
          >
            instagram.com/kimseontae_official
          </a>
        </div>
      </motion.div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >

          <h1 className="text-gradient-gold mb-3 text-4xl tracking-tight md:text-6xl lg:text-7xl">
            선태의 선택
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            충주맨 김선태가 선택한{" "}
            <span className="font-bold text-primary">첫 번째 광고주</span>는 누구일까?
          </p>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span>실시간 투표 진행중</span>
            </div>
            <div className="h-4 w-px bg-border" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
