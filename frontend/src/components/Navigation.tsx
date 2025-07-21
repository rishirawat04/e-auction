import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Gavel, LogOut, User, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  user?: {
    id: string;
    fullName: string;
    role: 'auctioneer' | 'bidder';
  } | null;
  onLogout: () => void;
}

export const Navigation = ({ user, onLogout }: NavigationProps) => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Gavel className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AuctionPro
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/auctions">
                    <Button 
                      variant={location.pathname === '/auctions' ? 'default' : 'ghost'}
                    >
                      Browse Auctions
                    </Button>
                  </Link>
                  
                  {user.role === 'auctioneer' && (
                    <>
                      <Link to="/admin/dashboard">
                        <Button 
                          variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                        >
                          Dashboard
                        </Button>
                      </Link>
                      <Link to="/admin/create-auction">
                        <Button size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          Create Auction
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  {/* {user.role === 'bidder' && (
                    <Link to="/my-bids">
                      <Button 
                        variant={location.pathname === '/my-bids' ? 'default' : 'ghost'}
                      >
                        My Bids
                      </Button>
                    </Link>
                  )} */}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-card" align="end" forceMount>
                    <DropdownMenuItem className="flex-col items-start">
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </div>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};