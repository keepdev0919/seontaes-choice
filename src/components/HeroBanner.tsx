import { motion } from "framer-motion";
import { Youtube, TrendingUp } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card py-8 md:py-12">
      {/* Decorative elements */}
      <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Youtube className="h-4 w-4" />
            김선태 채널 실시간 트래킹
          </div>

          <h1 className="text-gradient-gold mb-3 text-4xl tracking-tight md:text-6xl lg:text-7xl">
            선태의 선택
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            김선태 전 주무관 채널에 등판한 기업 중,{" "}
            <span className="font-bold text-primary">첫 번째 광고주</span>는 누구일까?
          </p>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span>실시간 투표 진행중</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span>목업 데이터 · YouTube API 연동 예정</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroBanner;
