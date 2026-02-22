import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Star,
    Trophy,
    Swords,
    Crosshair,
    UserPlus,
    UserCheck,
    Loader2,
    Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const GamerCard = ({ athlete, onFollow, isFollowing: initialIsFollowing, currentUser }) => {
    // Note: 'athlete' prop is used for the user object to maintain compatibility with existing data structures
    // but semantically represents a 'gamer' in this context.
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            toast.error('Please login to follow gamers');
            return;
        }

        setIsLoading(true);
        const wasFollowing = isFollowing;
        setIsFollowing(!wasFollowing);

        try {
            await onFollow(athlete._id);
            toast.success(wasFollowing ? `Unfollowed ${athlete.name}` : `Following ${athlete.name}`);
        } catch (error) {
            setIsFollowing(wasFollowing);
            toast.error('Failed to update follow status');
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    };

    // Safely extract relevant nested fields
    const userObj = athlete.user || {};
    const primaryGame = athlete.games && athlete.games.length > 0 ? athlete.games[0] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group h-full"
        >
            <Card className="overflow-hidden border-purple-500/20 bg-black/40 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300 h-full flex flex-col backdrop-blur-md">
                {/* Header Banner - Neon Gradient */}
                <div className="h-24 bg-gradient-to-r from-purple-900/40 via-black/50 to-cyan-900/40 relative">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                    {/* Rank/Rating Badge */}
                    {athlete.stats?.rating > 0 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-purple-500/30">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold text-white">
                                {athlete.stats.rating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Avatar Overlapping Header */}
                <div className="px-5 -mt-10 mb-3 flex justify-between items-end">
                    <Link to={`/profile/${userObj._id || athlete._id}`}>
                        <div className="relative">
                            <Avatar className="w-20 h-20 border-4 border-[#09090b] shadow-lg ring-2 ring-purple-500/50">
                                <AvatarImage src={userObj.avatar?.url} alt={athlete.gamertag || userObj.name} className="object-cover" />
                                <AvatarFallback className="bg-purple-900/50 text-purple-200 font-bold text-xl border border-purple-500/30">
                                    {getInitials(athlete.gamertag || userObj.name)}
                                </AvatarFallback>
                            </Avatar>
                            {/* Online status mock / placeholder */}
                            {athlete.isOnline && (
                                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#09090b] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            )}
                        </div>
                    </Link>
                </div>

                {/* Content */}
                <CardContent className="px-5 pb-4 flex-grow space-y-4">
                    {/* Name & Username */}
                    <div>
                        <Link to={`/profile/${userObj._id || athlete._id}`}>
                            <h3 className="font-bold font-heading text-white group-hover:text-cyan-400 transition-colors truncate text-xl">
                                {athlete.gamertag || userObj.name}
                            </h3>
                        </Link>
                        <p className="text-sm text-purple-300/80 font-medium">@{userObj.username || (athlete.gamertag?.replace(/\s+/g, '').toLowerCase() || 'player')}</p>
                    </div>

                    {/* Game Titles Tags */}
                    <div className="flex flex-wrap gap-2">
                        {primaryGame ? (
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20">
                                <Gamepad2 className="w-3 h-3 mr-1" />
                                {primaryGame.gameTitle}
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20">
                                <Gamepad2 className="w-3 h-3 mr-1" />
                                General
                            </Badge>
                        )}
                        {primaryGame?.role && (
                            <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
                                {primaryGame.role}
                            </Badge>
                        )}
                        {athlete.region && (
                            <Badge variant="outline" className="border-white/10 text-gray-400">
                                {athlete.region}
                            </Badge>
                        )}
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-white/5">
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5">
                            <Swords className="w-4 h-4 text-purple-400 mb-1" />
                            <span className="text-sm font-bold text-white text-center truncate w-full">{primaryGame?.rank || "Unranked"}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Rank</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5">
                            <Crosshair className="w-4 h-4 text-red-400 mb-1" />
                            <span className="text-sm font-bold text-white">{athlete.stats?.matchesWon || 0}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Wins</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 border border-white/5">
                            <Trophy className="w-4 h-4 text-yellow-400 mb-1" />
                            <span className="text-sm font-bold text-white">{athlete.stats?.tournamentsWon || 0}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Tourneys</span>
                        </div>
                    </div>
                </CardContent>

                {/* Footer Actions */}
                <CardFooter className="px-5 py-4 bg-white/5 border-t border-white/5 gap-3">
                    <Link to={`/profile/${userObj._id || athlete._id}`} className="flex-1">
                        <Button
                            variant="secondary"
                            className="w-full bg-white/5 hover:bg-white/10 text-white border-0 hover:text-cyan-300 transition-colors"
                        >
                            View Profile
                        </Button>
                    </Link>
                    {currentUser && currentUser.id !== (userObj._id || athlete._id) && (
                        <Button
                            size="icon"
                            onClick={handleFollow}
                            disabled={isLoading}
                            className={cn(
                                "transition-all border-0",
                                isFollowing
                                    ? "bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                                    : "bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-lg shadow-purple-900/20"
                            )}
                        >
                            {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isFollowing ? (
                                <UserCheck className="w-4 h-4" />
                            ) : (
                                <UserPlus className="w-4 h-4" />
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default GamerCard;
