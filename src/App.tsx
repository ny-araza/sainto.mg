import { motion } from "framer-motion";
import { About } from "./components/About";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { ScrollToTop } from "./components/ScrollToTop";
import { Services } from "./components/Services";
import { Testimonials } from "./components/Testimonials";
// import AccordionGallery from "./components/AccordionGallery";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

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
      <Routes>
        <Route path="/products" element={<Hero />} />
      </Routes>
      <CartProvider>
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
          <Testimonials />
        </FadeInSection>
        {/*<FadeInSection>
        <Team />
      </FadeInSection>*/}
        {/*<FadeInSection>
        <Pricing />
      </FadeInSection>*/}
        {/*<FadeInSection>
        <Newsletter />
      </FadeInSection>*/}
        <FadeInSection>
          <FAQ />
        </FadeInSection>
        <Footer />
        <ScrollToTop />
      </CartProvider>
    </>
  );
}

export default App;
