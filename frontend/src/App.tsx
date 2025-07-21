import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { AuctionList } from "./pages/AuctionList";
import NotFound from "./pages/NotFound";
import { AuctionDetails } from "./pages/AuctionDetail";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PrivateRoute } from "./components/privateRoute";
import { CreateAuction } from "./pages/createAuction";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute allowedRoles={["bidder"]} />}>
          <Route path="/auctions" element={<AuctionList />} />
          <Route path="/auction/detail/:id" element={<AuctionDetails />} />
          </Route>
          

          {/*  Protected admin routes */}
          <Route element={<PrivateRoute allowedRoles={["auctioneer"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-auction" element={<CreateAuction />} />
            <Route path="/admin/auction/:id" element={<AuctionDetails />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
