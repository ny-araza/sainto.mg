import { Features } from "@/components/Features";

export default function ArticlePage() {
  return (
    <main className="min-h-screen">
      <div className="container py-12 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Tous nos <span className="text-blue-500">articles</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Découvrez l&apos;ensemble de notre gamme de produits Sainto.
        </p>
      </div>
      <Features />
    </main>
  );
}
