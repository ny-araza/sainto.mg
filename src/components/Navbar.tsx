import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { buttonVariants } from "./ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import logo from "../assets/logo_sainto_01.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faRobot } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./animate-ui/components/buttons/button";
import { useCart } from "@/context/CartContext";
import { MyChart } from "./modal/myCart/myCart";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Nos produits",
  },
  {
    href: "#testimonials",
    label: "FeedBacks",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
  {
    href: "#footer",
    label: "Nous contancter",
  },
];

export const Navbar = () => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { ouvrirPanier } = useCart();
  return (
    <header
      className="
        fixed
        top-0
        z-40
        w-full
        border-b
        border-white/10
        bg-background/60
        backdrop-blur-md
        supports-[backdrop-filter]:bg-background/30
      "
    >
      <MyChart></MyChart>
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container flex h-14 w-screen justify-between px-4">
          <NavigationMenuItem className="flex font-bold">
            <a
              rel="noreferrer noopener"
              href="/"
              className="ml-2 flex items-center text-xl font-bold"
            >
              <img src={logo} alt="logo_sainto" className="w-[90px] mt-2" />
            </a>
          </NavigationMenuItem>

          {/* Mobile */}
          <span className="flex md:hidden">
            <ModeToggle />

            <Sheet open={isOpenMenu} onOpenChange={setIsOpenMenu}>
              <SheetTrigger className="px-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </SheetTrigger>

              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold flex justify-center">
                    <img
                      src={logo}
                      alt="logo_sainto"
                      className="w-[90px] mt-2"
                    />
                  </SheetTitle>
                </SheetHeader>

                <nav className="mt-4 flex flex-col items-center justify-center gap-2">
                  {routeList.map(({ href, label }) => (
                    <a
                      rel="noreferrer noopener"
                      key={label}
                      href={href}
                      onClick={() => setIsOpenMenu(false)}
                      className={buttonVariants({
                        variant: "ghost",
                      })}
                    >
                      {label}
                    </a>
                  ))}

                  <a
                    rel="noreferrer noopener"
                    href="#"
                    target="_blank"
                    className={`w-[110px] pr-5 pl-5 border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <FontAwesomeIcon className="mr-2" icon={faRobot} />
                    Assistant AI
                  </a>
                  <Button
                    className="hover:bg-blue-800 bg-blue-500"
                    onClick={ouvrirPanier}
                  >
                    <FontAwesomeIcon icon={faCartShopping} />
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* Desktop */}
          <nav className="hidden gap-2 md:flex">
            {routeList.map((route) => (
              <a
                rel="noreferrer noopener"
                href={route.href}
                key={route.label}
                className={`text-[17px] ${buttonVariants({
                  variant: "ghost",
                })}`}
              >
                {route.label}
              </a>
            ))}
          </nav>

          <div className="hidden gap-2 md:flex justify-center items-center">
            <Button variant={"ghost"}>
              <FontAwesomeIcon className="mr-2" icon={faRobot} />
              Assistant AI
            </Button>

            <ModeToggle />
            <Button
              className="bg-blue-500 hover:bg-blue-800"
              onClick={ouvrirPanier}
            >
              <FontAwesomeIcon icon={faCartShopping} />
            </Button>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
