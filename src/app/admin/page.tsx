import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { resolve } from "path";
import React from "react";

const getOrdersData = async () => {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    ammount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfOrders: data._count,
  };
};

const getUsersData = async () => {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
};

const getProductsData = async () => {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailable: true } }),
    db.product.count({ where: { isAvailable: false } }),
  ]);

  return {
    activeCount,
    inactiveCount,
  };
};

const AdminDashboard = async () => {
  const [ordersData, usersData, productsData] = await Promise.all([
    getOrdersData(),
    getUsersData(),
    getProductsData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Orders"
        subtitle={`${formatNumber(ordersData.numberOfOrders)} Orders`}
        body={formatCurrency(ordersData.ammount)}
      />
      <DashboardCard
        title="Users"
        subtitle={`${formatCurrency(
          usersData.averageValuePerUser
        )} Average Value`}
        body={`${formatNumber(usersData.userCount)} Users`}
      />
      <DashboardCard
        title="Products"
        subtitle={`${formatNumber(productsData.inactiveCount)} Inactive`}
        body={formatNumber(productsData.activeCount)}
      />
    </div>
  );
};

type DashboardCardProps = {
  title: String;
  subtitle: String;
  body: String;
};

const DashboardCard = ({ title, subtitle, body }: DashboardCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  );
};

export default AdminDashboard;
