import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { createAuction, handleLogout } from "@/services/api";
import { Navigation } from "@/components/Navigation";

export const CreateAuction = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bidType, setBidType] = useState("highest");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const handleCreate = async () => {
    setLoading(true);
    const auctionData = {
      title,
      description,
      basePrice,
      startTime,
      endTime,
      imageUrl,
      bidType,
    };
    try {
      await createAuction(auctionData);
      toast({ title: "Auction created successfully" });
      setTitle("");
      setDescription("");
      setBasePrice(0);
      setStartTime("");
      setEndTime("");
      setImageUrl("");
      setBidType("highest");
    } catch (err) {
      toast({ title: "Error", description: "Failed to create auction" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation user={user} onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Create Auction</h1>

        <Card>
          <CardHeader>
            <CardTitle>Create a new auction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Auction Title"
                className="w-full"
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full"
              />
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                placeholder="Base Price"
                className="w-full"
              />
              <Input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
              />
              <Input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
              />
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL"
                className="w-full"
              />
              <div className="flex gap-4">
                <Button onClick={handleCreate} disabled={loading}>
                  {loading ? "Creating..." : "Create Auction"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
