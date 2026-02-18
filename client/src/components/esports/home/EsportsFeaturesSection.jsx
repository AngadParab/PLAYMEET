import { useState } from 'react'
import {
    Monitor,
    Users,
    Target,
    Zap,
    Trophy,
    Globe,
    Sparkles,
    MessageCircle,
    Shield,
    Smartphone,
    Crosshair,
    Cpu
} from 'lucide-react'

const EsportsFeaturesSection = () => {
    const features = [
        {
            icon: Crosshair,
            title: "Smart Scrim Finder",
            description: "AI-powered matchmaking to find scrim partners of your team's exact skill level and region.",
        },
        {
            icon: Trophy,
            title: "Tournament Management",
            description: "Automated bracket generation, score reporting, and prize distribution for seamless tournament hosting.",
        },
        {
            icon: Users,
            title: "Team Rosters",
            description: "Manage your squad, track player roles, and recruit new talent with advanced profile filtering.",
        },
        {
            icon: MessageCircle,
            title: "Lobby Chat & Voice",
            description: "Integrated low-latency voice and text channels for instant team communication and coordination.",
        },
        {
            icon: Target,
            title: "Performance Analytics",
            description: "Track K/D ratios, win rates, and objective control with detailed post-match statistical breakdowns.",
        },
        {
            icon: Smartphone,
            title: "Mobile Companion",
            description: "Accept matches, check schedules, and chat with your team on the go with our dedicated mobile app.",
        },
    ]

    return (
        <section className='py-24 bg-background border-t border-border relative overflow-hidden'>
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

            <div className='container mx-auto px-4'>
                <div className='text-center max-w-3xl mx-auto mb-16'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6'>
                        <Sparkles className='w-4 h-4' />
                        <span className='uppercase tracking-widest'>Nexus Features</span>
                    </div>
                    <h2 className='text-3xl md:text-4xl font-bold font-heading text-foreground mb-6'>
                        Everything you need to <br />
                        <span className='text-primary'>Dominate the Server</span>
                    </h2>
                    <p className='text-lg text-muted-foreground leading-relaxed'>
                        Our platform combines pro-level tools with community features to elevate your competitive gaming experience.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {features.map((feature, index) => (
                        <div key={index} className='group p-8 rounded-2xl bg-secondary/10 border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300'>
                            <div className='w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300'>
                                <feature.icon className='w-7 h-7 text-foreground group-hover:text-white transition-colors' />
                            </div>
                            <h3 className='text-xl font-bold font-heading text-foreground mb-3'>
                                {feature.title}
                            </h3>
                            <p className='text-muted-foreground leading-relaxed'>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default EsportsFeaturesSection
