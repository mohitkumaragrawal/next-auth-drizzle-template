"use client";

import * as React from "react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormField,
  FormLabel,
  FormDescription,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useForm } from "react-hook-form";

const roleSchema = z.object({
  role: z.string().min(1, "Role is required"),
});
type RoleSchema = z.infer<typeof roleSchema>;

interface RowActionProps {
  userId: string;
  roles: string[];
  onConfirm: (roles: string[]) => void;
}

export function RowAction(props: RowActionProps) {
  const [roles, setRoles] = React.useState<string[]>(props.roles);

  React.useEffect(() => {
    setRoles(props.roles);
  }, [props.roles]);

  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: "",
    },
  });

  const handleSubmit = (schema: RoleSchema) => {
    setRoles((r) => {
      if (r.includes(schema.role)) return r;
      return [...r, schema.role];
    });

    form.reset();
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(props.userId)}
          >
            Copy User Id
          </DropdownMenuItem>

          <DialogTrigger asChild>
            <DropdownMenuItem className="w-full">Edit Roles</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Roles</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Edit the roles assigned to this user
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <Badge
              key={role}
              className="flex gap-1 justify-between items-center cursor-pointer group"
              variant="outline"
              onClick={() => {
                setRoles(roles.filter((r) => r !== role));
              }}
            >
              {role}

              <div className="hover:text-red-400 group-hover:text-red-400 cursor-pointer">
                <XIcon size={14} />
              </div>
            </Badge>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Role</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Add role to the user</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="secondary" type="submit">
                Add Role
              </Button>

              <DialogClose asChild>
                <Button onClick={() => props.onConfirm(roles)} type="button">
                  Save Changes
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
