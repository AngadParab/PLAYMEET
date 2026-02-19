import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, Users, ArrowRight, Trophy } from "lucide-react";

const games = [
    { name: "Valorant", genre: "Tactical Shooter", players: "125k Active", image: '/assets/esports/valorant.jpg' },
    { name: "Counter-Strike 2", genre: "Tactical Shooter", players: "300k Active", image: '/assets/esports/Counter strike 2.jpg' },
    { name: "League of Legends", genre: "MOBA", players: "500k Active", image: '/assets/esports/Legue Of Legends.jpg' },
    { name: "Dota 2", genre: "MOBA", players: "200k Active", image: '/assets/esports/dota 2.jpg' },
    { name: "Apex Legends", genre: "Battle Royale", players: "150k Active", image: '/assets/esports/Apex Legends.jpg' },
    { name: "Rocket League", genre: "Sports", players: "80k Active", image: '/assets/esports/Rocket Legue.avif' },
];

const EsportsGames = () => {
    return (
        <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-purple-500/30">
            {/* Background Effects */}
            <div className='fixed inset-0 z-0 pointer-events-none'>
                <div className='absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px]' />
                <div className='absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px]' />
            </div>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-3">
                        <Gamepad2 className="w-4 h-4" />
                        <span>Game Library</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-white">
                        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Games</span>
                    </h1>
                    <p className="text-gray-400 mt-2 max-w-2xl text-lg">
                        Explore the most popular competitive titles on Nexus.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <Card key={game.name} className="group border-white/5 bg-white/5 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.15)] transition-all duration-300 cursor-pointer overflow-hidden relative h-[320px]">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={game.image}
                                    alt={game.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/50 to-transparent" />
                            </div>

                            <CardContent className="relative z-10 p-6 flex flex-col h-full justify-end">
                                <div className="mb-auto">
                                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/20 backdrop-blur-md">
                                        {game.genre}
                                    </Badge>
                                </div>

                                <h3 className="font-bold font-heading text-2xl text-white mb-2 group-hover:text-cyan-400 transition-colors drop-shadow-md">{game.name}</h3>

                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <Users className="w-4 h-4 text-purple-400" />
                                        <span>{game.players}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EsportsGames;
