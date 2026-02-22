import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Coins, ArrowRight, Gift, CheckCircle2, Gamepad2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMode } from "@/context/ModeContext";
import api from "@/utils/api";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Store = () => {
    const { user } = useAuth();
    const { mode } = useMode();
    const isEsports = mode === 'esports';
    const [rewards, setRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [redeeming, setRedeeming] = useState(null);

    useEffect(() => {
        document.title = "Store - PLAYMEET";
        fetchRewards();
    }, []);

    const fetchRewards = async () => {
        try {
            const { data } = await api.get("/store/rewards");
            if (data.success) {
                setRewards(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch rewards", error);
            toast.error("Failed to load store inventory");
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async (reward) => {
        if (user?.pointsWallet < reward.cost) {
            toast.error("Not enough points!");
            return;
        }

        if (!window.confirm(`Are you sure you want to redeem ${reward.name} for ${reward.cost} points?`)) {
            return;
        }

        setRedeeming(reward._id);
        try {
            const { data } = await api.post("/store/redeem", { rewardId: reward._id });
            if (data.success) {
                toast.success(`Successfully redeemed ${reward.name}! Our team will process your request shortly.`);
                fetchRewards(); // refresh stock
                // Note: the points wallet should ideally update via context, or user re-auth
            }
        } catch (error) {
            console.error("Redemption error", error);
            toast.error(error.response?.data?.message || "Redemption failed");
        } finally {
            setRedeeming(null);
        }
    };

    return (
        <div className={`min-h-screen ${isEsports ? 'bg-[#09090b] text-white font-sans selection:bg-purple-500/30' : 'bg-background'}`}>
            {isEsports && (
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]" />
                </div>
            )}
            {/* Hero Section */}
            <div className={`relative ${isEsports ? 'border-b border-purple-500/20 bg-black/40 backdrop-blur-sm' : 'border-b border-border/40 bg-card'} py-16 z-10`}>
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <Badge className={`${isEsports ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' : 'bg-primary/10 text-primary hover:bg-primary/20'} mb-4 inline-flex items-center gap-2`}>
                        {isEsports ? <Gamepad2 className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                        {isEsports ? "Nexus Market" : "Rewards Store"}
                    </Badge>
                    <h1 className={`text-4xl md:text-5xl font-black tracking-tight mb-4 ${isEsports && 'font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400'}`}>
                        {isEsports ? "Acquire Relics" : "Spend Your Earnings"}
                    </h1>
                    <p className={`${isEsports ? 'text-gray-400' : 'text-muted-foreground'} text-lg max-w-2xl mx-auto mb-8`}>
                        Redeem your hard-earned points for exclusive gear, gift cards, and experiences.
                    </p>

                    {user && (
                        <div className={`inline-flex items-center gap-3 ${isEsports ? 'bg-black/60 border border-purple-500/30' : 'bg-secondary/50 border border-border/50'} rounded-full px-6 py-3`}>
                            <span className={`${isEsports ? 'text-gray-400 font-mono text-sm' : 'text-muted-foreground font-medium'}`}>Your Balance:</span>
                            <div className={`flex items-center gap-1.5 ${isEsports ? 'text-purple-400' : 'text-primary'} font-bold text-xl`}>
                                <Coins className={`w-5 h-5 ${isEsports ? 'fill-purple-400/20' : 'fill-primary/20'}`} />
                                {user.pointsWallet?.toLocaleString() || 0} pts
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className={`container mx-auto px-4 py-12 max-w-6xl relative z-10`}>
                {!user && (
                    <Card className={`mb-12 ${isEsports ? 'border-purple-500/30 bg-purple-900/10' : 'border-primary/20 bg-primary/5'}`}>
                        <CardContent className="p-6 text-center">
                            <h3 className={`text-xl font-bold mb-2 ${isEsports && 'text-white'}`}>Sign in to redeem</h3>
                            <p className={`${isEsports ? 'text-gray-400' : 'text-muted-foreground'} mb-4`}>You need an account to earn points and claim rewards.</p>
                            <Button className={isEsports ? "bg-purple-600 hover:bg-cyan-600 text-white" : ""} asChild><Link to="/login">Login</Link></Button>
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Card key={i} className={`overflow-hidden ${isEsports ? 'bg-black/40 border-white/5' : ''}`}>
                                <Skeleton className={`h-48 w-full rounded-none ${isEsports ? 'bg-white/5' : ''}`} />
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className={`h-6 w-3/4 ${isEsports ? 'bg-white/10' : ''}`} />
                                    <Skeleton className={`h-4 w-1/4 ${isEsports ? 'bg-white/10' : ''}`} />
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Skeleton className={`h-10 w-full ${isEsports ? 'bg-white/10' : ''}`} />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : rewards.length === 0 ? (
                    <div className={`text-center py-24 ${isEsports ? 'text-gray-500' : 'text-muted-foreground'}`}>
                        <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${isEsports ? 'opacity-50 text-purple-400' : 'opacity-20'}`} />
                        <p className={`text-xl font-medium ${isEsports && 'font-heading text-gray-300'}`}>No rewards available right now.</p>
                        <p className={isEsports && 'font-mono text-sm mt-2'}>Check back later for new items!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rewards.map((reward, index) => {
                            const affordable = user && user.pointsWallet >= reward.cost;
                            const outOfStock = reward.stock <= 0;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={reward._id}
                                >
                                    <Card className={`h-full flex flex-col overflow-hidden transition-colors group ${isEsports ? 'border-purple-500/20 bg-black/40 backdrop-blur-sm hover:border-cyan-400/50' : 'border-border/50 hover:border-primary/50'}`}>
                                        <div className={`aspect-video relative ${isEsports ? 'bg-white/5 border-b border-white/5' : 'bg-muted'} flex items-center justify-center p-6 mix-blend-multiply dark:mix-blend-normal overflow-hidden`}>
                                            {reward.image ? (
                                                <img
                                                    src={reward.image}
                                                    alt={reward.name}
                                                    className={`object-contain w-full h-full group-hover:scale-105 transition-transform duration-300 ${isEsports && 'object-cover w-full h-full scale-[1.05] grayscale-[0.2]'}`}
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-lg bg-black/50 flex flex-col items-center justify-center p-2">
                                                    <Gift className="w-10 h-10 text-gray-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                                                </div>
                                            )}

                                            {outOfStock && (
                                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                                                    <Badge variant="destructive" className="scale-150 relative overflow-hidden">
                                                        {isEsports ? "OUT OF STOCK" : "SOLD OUT"}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <CardHeader className="flex-none pb-2">
                                            <div className="flex justify-between items-start gap-4">
                                                <CardTitle className={`text-lg leading-tight line-clamp-2 ${isEsports && 'text-white font-heading'}`}>{reward.name}</CardTitle>
                                                <Badge variant="secondary" className={`font-bold shrink-0 items-center gap-1 ${isEsports && 'bg-black text-cyan-400 border border-cyan-500/30'}`}>
                                                    <Coins className={`w-3 h-3 ${isEsports ? 'text-cyan-400' : 'text-amber-500 fill-amber-500/20'}`} />
                                                    {reward.cost.toLocaleString()}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className={`flex-1 grid place-items-start text-sm ${isEsports ? 'text-gray-400 font-mono text-xs' : 'text-muted-foreground'}`}>
                                            {/* Optional description here */}
                                            <p>{reward.stock} remaining in stock</p>
                                        </CardContent>

                                        <CardFooter className="pt-4">
                                            <Button
                                                className={`w-full ${isEsports ? 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wide transition-all data-[disabled=true]:bg-gray-800' : ''}`}
                                                disabled={!user || outOfStock || !affordable || redeeming === reward._id}
                                                variant={(!isEsports && affordable && !outOfStock) ? "default" : (isEsports ? undefined : "secondary")}
                                                onClick={() => handleRedeem(reward)}
                                                data-disabled={!user || outOfStock || !affordable || redeeming === reward._id}
                                            >
                                                {outOfStock ? (
                                                    'Out of Stock'
                                                ) : redeeming === reward._id ? (
                                                    isEsports ? '> PROCESSING...' : 'Processing...'
                                                ) : !user ? (
                                                    'Login to Redeem'
                                                ) : !affordable ? (
                                                    isEsports ? 'INSUFFICIENT FUNDS' : 'Need More Points'
                                                ) : (
                                                    <>Redeem Now <ArrowRight className="w-4 h-4 ml-2" /></>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Store;
