"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b bg-white dark:bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-bold">CampusMart</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/sell">
                <Package className="mr-2 h-4 w-4" />
                Sell Item
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}