import {
  Tilt,
  TiltContent,
} from "@/components/animate-ui/primitives/effects/tilt";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

type ProduitProps = {
  id: number,
  name: string;
  price: number;
  rate: number;
};

type TiltDemoProps = {
  maxTilt?: number;
  perspective?: number;
  image: string;
  product: ProduitProps;
};

export default function TiltDemo({
  maxTilt,
  perspective,
  image,
  product,
}: TiltDemoProps) {
  const rating = Math.min(5, Math.max(0, Math.round(product.rate)));

  return (
    <Tilt
      className="w-full max-w-[250px] cursor-pointer"
      maxTilt={maxTilt}
      perspective={perspective}
    >
      <TiltContent asChild>
        <Card className="w-full gap-2 overflow-hidden p-0">
          <CardHeader className="p-2 pb-1">
            <img
              src={image}
              alt={product.name}
              width={250}
              height={250}
              className="aspect-square w-full rounded-md object-cover"
            />
          </CardHeader>

          <CardContent className="space-y-2 text-center">
            <h3 className="font-semibold">{product.name}</h3>

            <p className="text-base font-medium">{product.price} Ar</p>

            <div
              className="flex items-center justify-center gap-1"
              aria-label={`Note : ${product.rate} sur 5`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  className={
                    star <= rating
                      ? "text-yellow-400 drop-shadow-sm"
                      : "text-gray-200"
                  }
                />
              ))}

              <span className="ml-1 text-xs font-medium text-muted-foreground">
                {product.rate}/5
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-center pb-5 pt-1">
            <ul
              role="list"
              className="flex items-center justify-center space-x-3 [&>li]:size-4.5 [&>li]:rounded-full [&>li]:border"
            >
              <li className="bg-neutral-800" />
              <li className="bg-red-950" />
              <li className="bg-blue-950" />
            </ul>
          </CardFooter>
        </Card>
      </TiltContent>
    </Tilt>
  );
}
