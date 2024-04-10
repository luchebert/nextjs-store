import React from "react";
import PageHeader from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { CheckCircle2, XCircle } from "lucide-react";
import { formatNumber } from "@/lib/formatters";

const AdminProductsPage = () => {
  return (
    <>
      <div className="flex justify-between items-center gape-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductTable />
    </>
  );
};

const ProductTable = async () => {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      isAvailable: true,
      priceInCents: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available for Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.isAvailable ? (
                <>
                  <CheckCircle2 />
                </>
              ) : (
                <>
                  <XCircle />
                </>
              )}
            </TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.priceInCents}</TableCell>
            <TableCell>{formatNumber(Number(product._count))}</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminProductsPage;
