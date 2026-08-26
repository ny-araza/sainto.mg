import { motion } from "framer-motion";

import { About } from "./components/About";
import { Cta } from "./components/Cta";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { Newsletter } from "./components/Newsletter";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Team } from "./components/Team";
import { Testimonials } from "./components/Testimonials";
// import AccordionGallery from "./components/AccordionGallery";
import "./App.css";

// Composant wrapper pour réutiliser l'animation
function FadeInSection({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Départ : invisible et 50px plus bas
      whileInView={{ opacity: 1, y: 0 }} // Arrivée : visible et à sa position normale
      viewport={{ once: true, margin: "-100px" }} // S'exécute 1 seule fois dès qu'elle est visible
      transition={{ duration: 0.5, ease: "easeOut" }} // Durée et fluidité++++---+
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <FadeInSection>
        <About />
      </FadeInSection>
      <FadeInSection>
        <HowItWorks />
      </FadeInSection>
      <FadeInSection>
        <Features />
      </FadeInSection>
      <FadeInSection>
        <Services />
      </FadeInSection>
      <FadeInSection>
        <Cta />
      </FadeInSection>
      <FadeInSection>
        <Testimonials />
      </FadeInSection>
      <FadeInSection>
        <Team />
      </FadeInSection>
      <FadeInSection>
        <Pricing />
      </FadeInSection>
      <FadeInSection>
        <Newsletter />
      </FadeInSection>
      <FadeInSection>
        <FAQ />
      </FadeInSection>
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
