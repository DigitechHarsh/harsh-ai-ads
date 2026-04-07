import { motion } from "framer-motion";

const FinalCTA = () => (
  <section className="py-20 px-4">
    <div className="container max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl md:text-4xl font-display font-bold">
          Don't Let Your Product Look <span className="text-destructive">Cheap</span>
        </h2>
      </motion.div>
    </div>
  </section>
);

export default FinalCTA;
