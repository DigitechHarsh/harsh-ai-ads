import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const SolutionSection = () => (
  <section className="py-10 md:py-16 px-4">
    <div className="container max-w-3xl text-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.1
            }
          }
        }}
        className="relative"
      >
        <motion.div
          variants={{
            hidden: { scale: 0, rotate: -20 },
            visible: { scale: 1, rotate: 0 }
          }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <Sparkles className="w-16 h-16 text-gold mx-auto mb-8 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
        </motion.div>

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-3xl md:text-5xl font-display font-bold mb-8"
        >
          The <span className="text-gold-gradient italic">Ultimate</span> Solution
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light tracking-wide"
        >
          We transform ordinary products into <span className="text-foreground font-semibold border-b-2 border-gold/30">Premium Masterpieces</span> that capture attention and <span className="text-gold font-bold">10x your conversions.</span>
        </motion.p>
      </motion.div>
    </div>
  </section>
);

export default SolutionSection;
