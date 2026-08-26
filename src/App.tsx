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
import { Sponsors } from "./components/Sponsors";
import { Team } from "./components/Team";
import { Testimonials } from "./components/Testimonials";
// import AccordionGallery from "./components/AccordionGallery";
import "./App.css";

function App() {
  // const items = [
  //   {
  //     image: "https://picsum.photos/id/1015/900/1200",
  //     label: "Canyon",
  //     link: "#",
  //   },
  //   {
  //     image: "https://picsum.photos/id/1018/900/1200",
  //     label: "Ridgeline",
  //     link: "#",
  //   },
  //   {
  //     image: "https://picsum.photos/id/1039/900/1200",
  //     label: "Falls",
  //     link: "#",
  //   },
  //   {
  //     image: "https://picsum.photos/id/1043/900/1200",
  //     label: "Harbour",
  //     link: "#",
  //   },
  //   {
  //     image: "https://picsum.photos/id/1044/900/1200",
  //     label: "Skyline",
  //     link: "#",
  //   },
  // ];

  return (
    <>
      <Navbar />
      <Hero />

      {/*<AccordionGallery
        items={items}
        defaultIndex={2}
        expandRatio={0.52}
        trigger="hover"
        accentColor="#ffffff"
        overlayColor="#060010"
        textColor="#ffffff"
        grayscale
        showLabels
        duration={0.6}
        ease="power3.out"
        parallax={0.5}
        tilt={9}
        stagger={0.06}
        height={460}
        gap={10}
        radius={16}
        orientation="horizontal"
      />*/}

      <Sponsors />
      <About />
      <HowItWorks />
      <Features />
      <Services />
      <Cta />
      <Testimonials />
      <Team />
      <Pricing />
      <Newsletter />
      <FAQ />
      <Footer />
      <ScrollToTop />
    </>
  );
}

export default App;
