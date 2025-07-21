import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gavel, TrendingUp, Users, ArrowRight, Star } from "lucide-react";
import { AuctionCard } from "@/components/AuctionCard";
import { Navigation } from "@/components/Navigation";
import { Auction } from "@/types/auction";
import { getAuctions, handleLogout } from "@/services/api";

const Index = () => {
  const [user, setUser] = useState(null);
  const [featuredAuctions, setFeaturedAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user and set it to state
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchFeatured = async () => {
      try {
        const response = await getAuctions({ status: "live", sortBy: "endTime" });
        setFeaturedAuctions(response.slice(0, 2));
      } catch (error) {
        console.error("Error fetching featured auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);



  return (
    <div className="min-h-screen bg-background">
      <Navigation user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-6">
              <Gavel className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AuctionPro
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The premier platform for online auctions. Buy unique items or sell your treasures 
              to a global audience with real-time bidding.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!user ? (
                <>
                  <Link to="/register">
                    <Button size="lg" className="gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/auctions">
                    <Button variant="outline" size="lg">
                      Browse Auctions
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auctions">
                    <Button size="lg" className="gap-2">
                      Browse Auctions
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  {user.role === 'auctioneer' && (
                    <Link to="/create-auction">
                      <Button variant="outline" size="lg">
                        Create Auction
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">$2.5M+</CardTitle>
                <CardDescription>Total Sales Volume</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">10K+</CardTitle>
                <CardDescription>Active Users</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Gavel className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle className="text-3xl font-bold">25K+</CardTitle>
                <CardDescription>Completed Auctions</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Live Auctions</h2>
            <p className="text-muted-foreground text-lg">
              Don't miss these exciting auctions ending soon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {loading ? (
              <p>Loading featured auctions...</p>
            ) : (
              featuredAuctions.map((auction) => (
                <AuctionCard 
                  key={auction.id} 
                  auction={auction}
                  userRole={user?.role}
                />
              ))
            )}
          </div>

          <div className="text-center">
            <Link to="/auctions">
              <Button variant="outline" size="lg" className="gap-2">
                View All Auctions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">
              Simple steps to start buying or selling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              { step: "1", title: "Sign Up", desc: "Create your account as either a bidder or auctioneer" },
              { step: "2", title: "Browse or Create", desc: "Browse exciting auctions or create your own to sell items" },
              { step: "3", title: "Bid & Win", desc: "Place bids in real-time and win amazing items at great prices" }
            ].map(({ step, title, desc }) => (
              <Card key={step}>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold">{step}</span>
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users already buying and selling on AuctionPro
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  <Star className="h-4 w-4" />
                  Sign Up Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
