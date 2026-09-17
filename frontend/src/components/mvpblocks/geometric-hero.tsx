'use client';

import { easeInOut, motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = 'from-white/[0.08]',
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn('absolute', className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r to-transparent',
            gradient,
            'border border-white/30 backdrop-blur-[2px]',
            'shadow-[0_8px_32px_0_rgba(124,92,252,0.18)]',
            'after:absolute after:inset-0 after:rounded-full',
            'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.28),transparent_70%)]',
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroGeometric({
  badge = 'Business AI directory',
  title1 = 'Find the right AI',
  title2 = 'for every workflow',
  description = 'Discover practical tools for growth, sales, support, finance, operations, and the teams that keep your business moving.',
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
}) {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: easeInOut,
      },
    }),
  };

  return (
    <div className="relative isolate flex min-h-[380px] w-full items-center justify-center overflow-hidden border-b border-white/[0.06] bg-black sm:min-h-[440px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(124,92,252,0.2),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.08),transparent_32%)]"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-violet-500/45"
          className="top-[15%] left-[-10%] md:top-[20%] md:left-[-5%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-cyan-400/35"
          className="top-[70%] right-[-5%] md:top-[75%] md:right-[0%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-indigo-400/35"
          className="bottom-[5%] left-[5%] md:bottom-[10%] md:left-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-400/35"
          className="top-[10%] right-[15%] md:top-[15%] md:right-[20%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-fuchsia-400/30"
          className="top-[5%] left-[20%] md:top-[10%] md:left-[25%]"
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/[0.06] px-3.5 py-1.5 text-violet-100 shadow-[0_8px_24px_rgba(124,92,252,0.12)] backdrop-blur-sm"
          >
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-violet-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em]">
              {badge}
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl md:mb-7 md:text-7xl">
              <span className="block">
                {title1}
              </span>
              <span className="mt-2 block text-white/45">
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="mx-auto mb-9 max-w-2xl px-4 text-sm leading-6 text-neutral-300 sm:text-base sm:leading-7">
              {description}
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <Button asChild size="lg" className="rounded-full border border-white bg-white px-6 text-black shadow-[0_10px_28px_rgba(255,255,255,0.14)] hover:bg-white/90">
              <a href="#tools">
                Explore business tools
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </div>
  );
}
