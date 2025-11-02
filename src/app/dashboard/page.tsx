"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Package, ShoppingCart, Edit, Trash2 } from "lucide-react";
import { Product, Order } from "@/lib/types";
import { toast } from "sonner";

export default function DashboardPage() {
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [mySales, setMySales] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user ID - in production, this would come from auth
  const userId = 1;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, salesRes] = await Promise.all([
        fetch(`/api/products/my-products?sellerId=${userId}`),
        fetch(`/api/orders/my-orders?buyerId=${userId}`),
        fetch(`/api/orders/my-sales?sellerId=${userId}`),
      ]);

      const [products, orders, sales] = await Promise.all([
        productsRes.json(),
        ordersRes.json(),
        salesRes.json(),
      ]);

      setMyProducts(products);
      setMyOrders(orders);
      setMySales(sales);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete product");

      toast.success("Product deleted successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-muted/40 py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/40 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back!
            </p>
          </div>
          <Button asChild>
            <Link href="/sell">
              <Package className="mr-2 h-4 w-4" />
              List New Item
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings">
              My Listings ({myProducts.length})
            </TabsTrigger>
            <TabsTrigger value="purchases">
              My Purchases ({myOrders.length})
            </TabsTrigger>
            <TabsTrigger value="sales">
              My Sales ({mySales.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {myProducts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start selling by listing your first item
                  </p>
                  <Button asChild>
                    <Link href="/sell">Create Listing</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <Card key={product.id}>
                    <CardHeader className="p-0">
                      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                        <Badge
                          variant={product.status === "available" ? "default" : "secondary"}
                          className="absolute top-2 right-2"
                        >
                          {product.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-primary mb-4">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link href={`/products/${product.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Product</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this product? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="purchases">
            {myOrders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse the marketplace to find great deals
                  </p>
                  <Button asChild>
                    <Link href="/">Browse Products</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sales">
            {mySales.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No sales yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your sold items will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {mySales.map((sale) => (
                  <Card key={sale.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">Sale #{sale.id}</p>
                          <p className="text-sm text-muted-foreground">
                            Sold on {new Date(sale.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            sale.status === "completed"
                              ? "default"
                              : sale.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {sale.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}