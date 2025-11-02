"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, PackageOpen } from "lucide-react";
import { Product, CATEGORIES } from "@/lib/types";
import { toast } from "sonner";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?status=available");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <main className="min-h-screen bg-muted/40">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to CampusMart
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Your campus marketplace for buying and selling used items
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for items..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full rounded-lg" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PackageOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters
            </p>
            <Button asChild>
              <Link href="/sell">List Your First Item</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">
                      {product.category}
                    </Badge>
                    <CardTitle className="text-lg line-clamp-1 mb-2">
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}