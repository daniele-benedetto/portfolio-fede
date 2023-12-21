import { motion } from "framer-motion";
import { useState } from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  const [animationComplete, setAnimationComplete] = useState(false);

  const barAnimations = {
    initial: { width: "0px" },
    animate: { width: "150px" },
  };

  const windowAnimations = {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
  };

  const onAnimationComplete = () => {
      setAnimationComplete(true);
  };

  if (animationComplete) return false;

  return (
    <motion.div
      className={`${styles.bootupWindow} ${styles.boot}`}
      id="boot"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={windowAnimations}
      transition={{ ease: "easeInOut", duration: 0.5, delay: 2.5 }}
      onAnimationComplete={onAnimationComplete}
    >
          <img alt="Logo" className={styles.logo} src="/images/logo.png" style={{
            filter: "brightness(0) invert(1)"
          }} />
          <div className={styles.barContainer}>
            <div className={styles.barBackground} />
            <motion.div
              className={styles.bar}
              variants={barAnimations}
              transition={{ ease: "easeInOut", duration: 2.0, delay: 0.5 }}
            />
          </div>
    </motion.div>
  );
};

export default Loader;
