import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle, Clock, Search, ExternalLink } from "lucide-react";

const Fulfillment = () => {
    const [redemptions, setRedemptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        document.title = "Fulfillment Center - Admin";
        fetchPendingRedemptions();
    }, []);

    const fetchPendingRedemptions = async () => {
        try {
            const { data } = await api.get("/store/admin/redemptions/pending");
            if (data.success) {
                setRedemptions(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch redemptions", error);
            toast.error("Failed to load redemptions");
        } finally {
            setLoading(false);
        }
    };

    const handleFulfill = async (id, status, details = "") => {
        try {
            const { data } = await api.put(`/store/admin/redemptions/${id}`, {
                status,
                fulfillmentDetails: details
            });

            if (data.success) {
                toast.success(`Redemption marked as ${status}`);
                setRedemptions(prev => prev.filter(r => r._id !== id));
            }
        } catch (error) {
            console.error("Fulfillment error:", error);
            toast.error(error.response?.data?.message || "Failed to update redemption");
        }
    };

    const handleApprove = (id) => {
        const details = window.prompt("Enter fulfillment details (e.g., Gift Card Code, Tracking Number):");
        if (details !== null) { // if not cancelled
            handleFulfill(id, "fulfilled", details);
        }
    };

    const handleReject = (id) => {
        if (window.confirm("Are you sure you want to reject this redemption? Points will be refunded.")) {
            handleFulfill(id, "rejected");
        }
    };

    const filteredRedemptions = redemptions.filter(r =>
        r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reward?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fulfillment Center</h1>
                    <p className="text-muted-foreground mt-1">Manage pending reward redemptions</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by user or reward..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
                </div>
            ) : filteredRedemptions.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <CheckCircle2 className="w-16 h-16 mb-4 text-primary/20" />
                        <p className="text-xl font-medium">All caught up!</p>
                        <p className="mt-1">No pending redemptions to fulfill right now.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredRedemptions.map((redemption) => (
                        <Card key={redemption._id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="bg-muted p-6 flex flex-col justify-center items-center md:w-64 shrink-0 border-b md:border-b-0 md:border-r">
                                    {redemption.reward?.image ? (
                                        <img src={redemption.reward.image} alt={redemption.reward.name} className="w-32 h-32 object-contain mb-3 drop-shadow-sm mix-blend-multiply dark:mix-blend-normal" />
                                    ) : (
                                        <div className="w-32 h-32 bg-primary/10 rounded-xl mb-3 flex items-center justify-center">
                                            <Gift className="w-12 h-12 text-primary/40" />
                                        </div>
                                    )}
                                    <h3 className="font-bold text-center leading-tight line-clamp-2">{redemption.reward?.name}</h3>
                                    <Badge variant="secondary" className="mt-2">{redemption.reward?.cost} points</Badge>
                                </div>

                                <CardContent className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">Requested By</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-lg">{redemption.user?.name}</span>
                                                    <span className="text-muted-foreground">(@{redemption.user?.username})</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{redemption.user?.email}</p>
                                            </div>

                                            <Badge variant="outline" className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 border-amber-500/20">
                                                <Clock className="w-3.5 h-3.5" /> Pending
                                            </Badge>
                                        </div>

                                        <p className="text-xs text-muted-foreground mb-6">
                                            Requested on {format(new Date(redemption.createdAt), "PPP 'at' p")}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-auto">
                                        <Button
                                            onClick={() => handleApprove(redemption._id)}
                                            className="gap-2 bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Fulfill Order
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleReject(redemption._id)}
                                            className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject &amp; Refund
                                        </Button>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Fulfillment;
