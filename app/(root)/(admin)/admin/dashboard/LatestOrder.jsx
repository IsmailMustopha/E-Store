"use client"
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from 'next/image'
import notFound from '@/public/assets/images/not-found.png'
import useFetch from '@/hooks/useFetch'
import loading from "@/public/assets/images/loading.svg";
import { statusBadge } from '@/lib/helperFunction'


const LatestOrder = () => {
  const [latestOrder, setLatestOrder] = useState()
  const { data, loading } = useFetch("/api/dashboard/admin/latest-order");

  console.log(data)

  useEffect(() => {
    if (data && data.success) {
      setLatestOrder(data.data);
    }
  }, [data]);

  if (loading)
    return (
      <div className="h-full w-full flex justify-center items-center">
        Loading...
      </div>
    );

  if (!latestOrder || latestOrder.length === 0)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Image
          src={notFound.src}
          width={notFound.width}
          height={notFound.height}
          alt="not found"
          className="w-20"
        />
      </div>
    );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Id</TableHead>
            <TableHead>Payment Id</TableHead>
            <TableHead>Total Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {latestOrder?.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.payment_id}</TableCell>
              <TableCell>{order.products.length}</TableCell>
              <TableCell>{statusBadge(order.status)}</TableCell>
              <TableCell>{order.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default LatestOrder