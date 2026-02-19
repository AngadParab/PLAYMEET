import { Link } from 'react-router-dom';
import { Crosshair, Trophy, Users, ArrowRight, Sword, Gamepad2 } from 'lucide-react';

const EsportsGamesSection = () => {
    const games = [
        {
            id: 'valorant',
            name: 'Valorant',
            icon: Crosshair,
            participants: '150k+',
            tournaments: '45+',
            description: '5v5 character-based tactical shooter',
            image: '/assets/esports/valorant.jpg'
        },
        {
            id: 'cs2',
            name: 'CS2',
            icon: Crosshair,
            participants: '120k+',
            tournaments: '30+',
            description: 'The premier tactical shooter',
            image: '/assets/esports/Counter strike 2.jpg'
        },
        {
            id: 'lol',
            name: 'League of Legends',
            icon: Sword,
            participants: '200k+',
            tournaments: '60+',
            description: 'Multiplayer online battle arena',
            image: '/assets/esports/Legue Of Legends.jpg'
        },
        {
            id: 'dota2',
            name: 'Dota 2',
            icon: Sword,
            participants: '80k+',
            tournaments: '25+',
            description: 'Deepest strategy RTS',
            image: '/assets/esports/dota 2.jpg'
        },
        {
            id: 'rocket-league',
            name: 'Rocket League',
            icon: Gamepad2,
            participants: '90k+',
            tournaments: '40+',
            description: 'Soccer with rocket-powered cars',
            image: '/assets/esports/Rocket Legue.avif'
        },
        {
            id: 'apex',
            name: 'Apex Legends',
            icon: Users,
            participants: '110k+',
            tournaments: '35+',
            description: 'Team-based hero shooter',
            image: '/assets/esports/Apex Legends.jpg'
        },
    ];

    return (
        <section className='py-24 bg-[#09090b] relative overflow-hidden'>
            {/* Background Elements */}
            <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-b from-purple-900/5 to-transparent pointer-events-none" />

            <div className='container mx-auto px-4 relative z-10'>
                <div className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
                            <Gamepad2 className="w-4 h-4" />
                            <span>Supported Titles</span>
                        </div>
                        <h2 className='text-3xl md:text-5xl font-bold font-heading text-white'>
                            Featured <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400'>Esports Titles</span>
                        </h2>
                    </div>
                    <Link to='/esports/games' className='group flex items-center text-purple-400 hover:text-purple-300 font-semibold transition-colors'>
                        View All Games
                        <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
                    </Link>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {games.map((game, index) => (
                        <Link to={`/esports/games`} key={index} className='group relative'>
                            <div className='h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.1)] transition-all duration-300 group-hover:-translate-y-1 relative'>

                                {/* Background Image with Gradient Overlay */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={game.image}
                                        alt={game.name}
                                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-purple-900/20 mix-blend-multiply" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#09090b]" />
                                </div>

                                {/* Content */}
                                <div className="relative z-10 p-6 flex flex-col h-full">
                                    <div className='flex items-start justify-between mb-6'>
                                        <div className='w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-purple-600/80 group-hover:border-purple-500 transition-colors duration-300'>
                                            <game.icon className='w-6 h-6 text-white' />
                                        </div>
                                        <span className='px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs text-gray-300 border border-white/10 group-hover:border-purple-500/30 group-hover:text-purple-300 transition-colors'>
                                            {game.tournaments} Tournaments
                                        </span>
                                    </div>

                                    <h3 className='text-2xl font-bold font-heading text-white mb-2 group-hover:text-cyan-400 transition-colors drop-shadow-md'>
                                        {game.name}
                                    </h3>

                                    <p className='text-gray-300 text-sm mb-6 line-clamp-2'>
                                        {game.description}
                                    </p>

                                    <div className='mt-auto pt-4 border-t border-white/10 flex items-center justify-between text-sm text-gray-400 group-hover:text-gray-200'>
                                        <div className='flex items-center gap-2'>
                                            <Users className='w-4 h-4' />
                                            <span>{game.participants} Active</span>
                                        </div>
                                        <ArrowRight className='w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400' />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EsportsGamesSection;
