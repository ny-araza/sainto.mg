import pilot from "../assets/about_us.png";


export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <img
            src={pilot}
            alt=""
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b  bg-blue-800 to-primary text-transparent bg-clip-text">
                  Apropos{" "}
                </span>
                de Nous
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Sainto Madagascar est une marque dédiée à la fraîcheur et à
                l’hydratation au quotidien. Elle propose principalement des eaux
                potables et minérales de qualité, ainsi que des ice teas
                rafraîchissants, pensés pour accompagner chaque moment de la
                journée. À travers ses produits, Sainto souhaite offrir aux
                consommateurs malgaches une expérience simple, saine et
                agréable, fondée sur la pureté, le goût et la confiance. 
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
