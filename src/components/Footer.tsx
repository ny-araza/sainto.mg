import logo from "../assets/logo_sainto_01.png";
import logo_mado from "../assets/logo_mado.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
  return (
    <footer id="footer" className="border-t">
      <section className="container grid grid-cols-2 gap-x-12 gap-y-10 py-20 md:grid-cols-4 xl:grid-cols-6">
        {/* Logos */}
        <div className="col-span-full flex flex-col items-center xl:col-span-2 xl:items-start">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} alt="Sainto" className="mt-2 w-[90px]" />

            <img src={logo_mado} alt="Mado" className="mt-2 w-[165px]" />
          </div>

          <p className="mt-4 max-w-sm text-center text-sm text-muted-foreground xl:text-left">
            Sainto vous accompagne avec une eau de source naturelle et des
            boissons rafraîchissantes pour votre quotidien.
          </p>
        </div>

        {/* Réseaux sociaux */}
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold">Suivez-nous</h3>

          <div className="flex flex-wrap gap-3">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61579151713069"
              aria-label="Facebook"
              target="_blank"
              className="
                flex size-10 items-center justify-center
                rounded-full border
                text-lg
                transition-all duration-300
                hover:scale-110
                hover:bg-blue-600
                hover:text-white
              "
            >
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Navigation</h3>

          <a
            href="#features"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            Nos produits
          </a>

          <a
            href="#testimonials"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            Avis clients
          </a>

          <a
            href="#faq"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            FAQ
          </a>
        </div>

        {/* Produits */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Nos produits</h3>

          <a
            href="#features"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            Eau minérale
          </a>

          <a
            href="#features"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            Ice Tea
          </a>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Contact</h3>

          <a
            href="#"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            <p>4G4V+783,</p>
            <p>Antananarivo 101</p>
          </a>

          <a
            href="#"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            020 22 417 17
          </a>

          <a
            href="https://maps.app.goo.gl/q2DuQg3E7nL8zEGv7"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            Localisation Google Map
          </a>
        </div>
      </section>

      {/* Copyright */}
      <section className="container border-t pb-8 pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Sainto Madagascar. Tous droits réservés.
        </p>
      </section>
    </footer>
  );
};
