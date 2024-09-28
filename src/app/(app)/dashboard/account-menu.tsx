import { createClient } from "@/utils/supabase/server";
import { logout } from "@/app/auth/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AccountMenu() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9">
          <AvatarImage src="https://m.media-amazon.com/images/I/71JpPdKSEAL._AC_UY1100_.jpg" />
          <AvatarFallback className="text-xs font-bold">CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-normal text-xs text-muted-foreground">
            Signed in as
          </span>
          <span className="truncate">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logout}>
          <button className="w-full" type="submit">
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
