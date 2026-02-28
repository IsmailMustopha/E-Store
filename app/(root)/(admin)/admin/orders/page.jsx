"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ADMIN_COUPON_VARIANT_ADD,
  ADMIN_COUPON_VARIANT_EDIT,
  ADMIN_COUPON_VARIANT_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_ORDER_DETAILS,
  ADMIN_TRASH,
} from "@/app/routes/AdminPanelRoute";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import Link from "next/link";
import DatatableWrapper from "@/components/Application/Admin/DataTableWrapper";
import { DT_ORDER_COLUMN, } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import EditAction from "@/components/Application/Admin/EditAction";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import ViewAction from "@/components/Application/Admin/ViewAction";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Orders" },
];

const ShowOrder = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_ORDER_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];

    actionMenu.push(
      <ViewAction
        key="view"
        href={ADMIN_ORDER_DETAILS(row.original.order_id)}
      />,
    );

    actionMenu.push(
      <DeleteAction
        key="delete"
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />
    );

    return actionMenu;
  }, []);

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />

      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold">Orders</h4>
          </div>
        </CardHeader>
        <CardContent className="pb-5 px-0">
          <DatatableWrapper
            queryKey="orders-data"
            fetchUrl="/api/orders"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/orders/export"
            deleteEndpoint="/api/orders/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=orders`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowOrder;
