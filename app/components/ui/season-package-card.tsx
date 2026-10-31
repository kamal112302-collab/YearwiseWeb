import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Snowflake } from "lucide-react";
import { cn } from "~/lib/utils";

export type SeasonPackageCardProps = {
  title: string;
  subtitle: string;
  priceLabel: string;
  priceNote?: string;
  imageUrl: string;
  href?: string;
  featured?: boolean;
  className?: string;
};

export function SeasonPackageCard({
  title,
  subtitle,
  priceLabel,
  priceNote = "+ tax / season",
  imageUrl,
  href = "/contact",
  featured = false,
  className,
}: SeasonPackageCardProps) {
  const [hovered, setHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.25 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={cn(
        "relative isolate flex h-56 w-full items-end overflow-hidden rounded-2xl p-5 text-white sm:h-64 sm:p-6",
        featured && "ring-2 ring-brand-mint ring-offset-2 ring-offset-brand-navy",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10">
        <img
          src={imageUrl}
          alt=""
          width={900}
          height={600}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500",
            hovered && "scale-105",
          )}
          loading="lazy"
        />
        <div
          className={cn(
            "absolute inset-0",
            featured
              ? "bg-gradient-to-t from-brand-navy via-brand-navy/75 to-brand-green/35"
              : "bg-gradient-to-t from-brand-navy via-brand-navy/80 to-brand-navy/40",
          )}
        />
      </div>

      <div className="grid w-full grid-cols-[1.2fr_0.8fr] items-end gap-3">
        <div className="flex flex-col justify-end">
          <motion.p
            variants={itemVariants}
            className={cn(
              "text-xs font-semibold tracking-wide",
              featured ? "text-brand-mint" : "text-white/70",
            )}
          >
            {subtitle}
          </motion.p>
          <motion.h3 variants={itemVariants} className="mt-2 text-lg font-semibold leading-tight sm:text-xl">
            {title}
          </motion.h3>
          <motion.div variants={itemVariants} className="mt-4">
            <Link
              to={href}
              className={cn(
                "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                featured
                  ? "bg-brand-mint text-brand-navy hover:bg-white"
                  : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30",
              )}
            >
              <Snowflake className="size-4" aria-hidden />
              Book plan
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex flex-col items-end justify-end text-right">
          <p className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {priceLabel}
          </p>
          <p className="mt-1 text-xs font-medium text-white/75">{priceNote}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
