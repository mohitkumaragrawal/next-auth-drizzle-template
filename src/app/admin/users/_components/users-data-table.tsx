"use client";
import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckedState } from "@radix-ui/react-checkbox";
import ProfileImage from "@/components/profile/profile-image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BanIcon, TrashIcon } from "lucide-react";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";

import { fetchUsers } from "@/data/fetch-users";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import { banUsers, unbanUsers } from "@/actions/ban-user";
import { deleteUsers } from "@/actions/delete-user";

import { toast } from "sonner";
import { RowAction } from "./row-action";

import type { UserWithRoles } from "@/db/types";
import editRoles from "@/actions/edit-roles";

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

  const handleRoleChange = React.useCallback(
    (userId: string, roles: string[]) => {
      const changeRoles = async () => {
        await editRoles(userId, roles);
        await refreshData();
      };
      setLoading(true);
      toast.promise(changeRoles(), {
        loading: "Updating Roles...",
        error: (e) => `Error: ${e.message}`,
        success: "Roles updated successfully!",
        finally: () => setLoading(false),
      });
    },
    [],
  );

  const columns: ColumnDef<UserWithRoles>[] = React.useMemo(
    () => [
      {
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
      },
      {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Name
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-3">
            <ProfileImage imageUrl={row.original.image} />
            {row.getValue("name")}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("email")}</div>
        ),
      },
      {
        accessorKey: "username",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Username
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-3">
            {row.getValue("username")}
          </div>
        ),
      },
      {
        accessorKey: "roles",
        header: () => <p>Roles</p>,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.roles.map((role) => (
              <Badge key={role} variant="secondary" className="justify-center">
                {role}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Joined On
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {row.original.createdAt.toDateString()}
          </div>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <RowAction
              userId={user.id}
              roles={user.roles}
              onConfirm={(roles) => handleRoleChange(user.id, roles)}
            />
          );
        },
      },
    ],
    [],
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

  const handleUnbanConfirm = async () => {
    const banSelected = async () => {
      const selectedUsers = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);

      await unbanUsers(selectedUsers);
      await refreshData();
    };

    setLoading(true);
    toast.promise(banSelected(), {
      loading: "Unbanning Users...",
      error: (e) => `Error: ${e.message}`,
      success: "Users unbanned successfully!",
      finally: () => setLoading(false),
    });
  };

  const handleBanConfirm = async () => {
    const banSelected = async () => {
      const selectedUsers = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);

      await banUsers(selectedUsers);
      await refreshData();
    };

    setLoading(true);
    toast.promise(banSelected(), {
      loading: "Banning Users...",
      error: (e) => `Error: ${e.message}`,
      success: "Users banned successfully!",
      finally: () => setLoading(false),
    });
  };

  const handleDeleteConfirm = () => {
    const deleteSelected = async () => {
      const selectedUsers = table
        .getSelectedRowModel()
        .rows.map((row) => row.original.id);

      await deleteUsers(selectedUsers);
      await refreshData();
    };

    setLoading(true);
    toast.promise(deleteSelected(), {
      loading: "Deleting Users...",
      error: (e) => `Error: ${e.message}`,
      success: "Users deleted successfully!",
      finally: () => setLoading(false),
    });
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mb-3 flex flex-row-reverse gap-2">
        <Button variant="outline" onClick={refreshData}>
          Refresh
        </Button>
        {table.getSelectedRowModel().rows.length > 0 && (
          <>
            <ConfirmDialog
              onConfirm={handleUnbanConfirm}
              title="Are you sure want to unban the selected users?"
              description="The selected users will be unbanned"
            >
              <Button
                variant="default"
                className="flex items-center justify-center gap-2"
              >
                Unban
              </Button>
            </ConfirmDialog>
            <ConfirmDialog
              onConfirm={handleBanConfirm}
              title="Are you sure want to ban the selected users?"
              description="The selected users will be banned"
            >
              <Button
                variant="destructive"
                className="flex items-center justify-center gap-2"
              >
                <BanIcon size={16} />
                <span className="hidden md:inline">Ban</span>
              </Button>
            </ConfirmDialog>
            <ConfirmDialog onConfirm={handleDeleteConfirm}>
              <Button
                variant="destructive"
                className="flex items-center justify-center gap-2"
              >
                <TrashIcon size={16} />
                <span className="hidden md:inline">Delete</span>
              </Button>
            </ConfirmDialog>
          </>
        )}
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
