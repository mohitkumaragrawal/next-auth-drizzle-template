"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import ProfileImage from "@/components/profile/profile-image";
import { Badge } from "@/components/ui/badge";
import { BanIcon, RefreshCcwIcon, TrashIcon } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";

import { fetchUsers } from "@/data/fetch-users";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import { banUsers, unbanUsers } from "@/actions/ban-user";
import { deleteUsers } from "@/actions/delete-user";

import { toast } from "sonner";
import { RowAction } from "./row-action";

import type { UserWithRoles } from "@/db/types";
import editRoles from "@/actions/edit-roles";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const columnHelper = createColumnHelper<UserWithRoles>();

export function UsersDataTable({
  data: initialData,
}: {
  data: UserWithRoles[];
}) {
  const [data, setData] = React.useState(initialData);
  const [loading, setLoading] = React.useState(false);
  const refreshData = React.useCallback(async () => {
    setLoading(true);
    const newData = await fetchUsers();
    setData(newData);
    setLoading(false);
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const asyncUpdateData = React.useCallback(
    (
      updater: Promise<void>,
      _toasterData: { loading?: string; error?: string; success?: string } = {},
    ) => {
      setLoading(true);

      const updaterWithRefresh = async () => {
        await updater;
        await refreshData();
      };

      toast.promise(updaterWithRefresh(), {
        finally: () => setLoading(false),
        ..._toasterData,
      });
    },
    [refreshData],
  );

  const selectedIds = () =>
    table.getSelectedRowModel().rows.map((row) => row.original.id);

  const columns: ColumnDef<UserWithRoles>[] = React.useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              (table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() &&
                  "indeterminate")) as CheckedState
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-3">
            <ProfileImage imageUrl={row.original.image} />
            {row.getValue("name")}
          </div>
        ),
      }),
      columnHelper.accessor("email", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      }),
      columnHelper.accessor("username", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Username" />
        ),
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-3">
            {" "}
            {row.getValue("username")}
          </div>
        ),
      }),
      columnHelper.accessor("roles", {
        header: "Roles",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.roles.map((role) => (
              <Badge key={role} variant="secondary" className="justify-center">
                {role}
              </Badge>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Joined On" />
        ),
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.createdAt.toDateString()}
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <RowAction
              userId={user.id}
              roles={user.roles}
              onRolesChange={(roles) =>
                asyncUpdateData(editRoles(user.id, roles))
              }
              onBanUser={() => asyncUpdateData(banUsers([user.id]))}
              onDeleteUser={() => asyncUpdateData(deleteUsers([user.id]))}
              onUnbanUser={() => asyncUpdateData(unbanUsers([user.id]))}
              isBanned={user.banned}
            />
          );
        },
      }),
    ],
    [asyncUpdateData],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      refreshData,
    },
  });

  const someSelected = table.getSelectedRowModel().rows.length > 0;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-1 py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-1">
          <ConfirmDialog
            onConfirm={() => asyncUpdateData(banUsers(selectedIds()))}
            title="Are you sure want to ban the selected users?"
            description="The selected users will be banned"
          >
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              size="sm"
              disabled={!someSelected}
            >
              <BanIcon size={16} />
            </Button>
          </ConfirmDialog>
          <ConfirmDialog
            onConfirm={() => asyncUpdateData(deleteUsers(selectedIds()))}
          >
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              size="sm"
              disabled={!someSelected}
            >
              <TrashIcon size={16} />
            </Button>
          </ConfirmDialog>
          <Button variant="outline" onClick={refreshData} size="sm">
            <RefreshCcwIcon size={16} />
          </Button>
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    row.original.banned &&
                      "bg-red-900/30 hover:bg-red-900/40 data-[state='selected']:bg-red-700/40",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} className="my-3" />
    </div>
  );
}
