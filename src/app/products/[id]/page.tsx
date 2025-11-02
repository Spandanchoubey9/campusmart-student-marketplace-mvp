"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar } from "lucide-react";
import { Product } from "@/lib/types";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);

  // Mock user ID - in production, this would come from auth
  const userId = 1;

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      toast.error("Failed to load product");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!product) return;

    if (product.sellerId === userId) {
      toast.error("You cannot buy your own item");
      return;
    }

    setIsBuying(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          buyerId: userId,
          sellerId: product.sellerId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      // Update product status to sold
      await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "sold",
        }),
      });

      toast.success("Order placed successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-muted/40 py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;

  const isOwnProduct = product.sellerId === userId;
  const isSold = product.status === "sold";

  return (
    <main className="min-h-screen bg-muted/40 py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            {isSold && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-2xl py-2 px-6">
                  SOLD
                </Badge>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.category}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                  <p className="text-4xl font-bold text-primary mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Listed on {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {!isSold && !isOwnProduct && (
                  <Button
                    onClick={handleBuy}
                    size="lg"
                    className="w-full"
                    disabled={isBuying}
                  >
                    {isBuying ? "Processing..." : "Buy Now"}
                  </Button>
                )}

                {isOwnProduct && !isSold && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      This is your listing
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}