import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { Services } from "@/components/Services";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { motion } from "framer-motion";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ConfirmAddToCart } from "@/components/modal/myCart/ConfirmAddToCart";
import { CartNotification } from "@/components/modal/myCart/CarNotification";
import { AssistantProvider } from "@/context/AssistantContext";
import { MyChart } from "@/components/modal/myCart/myCart";
import { ChatAssistant } from "@/components/assistant/ChatAssistant";

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

export default function HomePage() {
  return (
    <CartProvider>
      <AssistantProvider>
        <ConfirmAddToCart />
        <CartNotification />
        <Navbar />
        <MyChart></MyChart>
        <ChatAssistant />
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
      </AssistantProvider>
    </CartProvider>
  );
}
