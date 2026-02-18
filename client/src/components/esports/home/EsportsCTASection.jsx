import { Link } from 'react-router-dom'
import {
    Rocket,
    ArrowRight,
    ChevronRight,
    Sparkles,
    Users,
    Trophy,
    Shield,
    Star,
    MonitorPlay,
    Gamepad2
} from 'lucide-react'

const EsportsCTASection = () => {
    // Non-authenticated user CTA (or generic public view)
    const features = [
        {
            icon: Users,
            label: 'Recruit Players',
            desc: 'Build your dream roster',
        },
        {
            icon: Gamepad2,
            label: 'Find Scrims',
            desc: 'Practice against the best',
        },
        {
            icon: Trophy,
            label: 'Win Prizes',
            desc: 'Compete in daily cups',
        },
        {
            icon: Shield,
            label: 'Anti-Cheat',
            desc: 'Verified fair play',
        }
    ]

    const stats = [
        { label: "Active Players", value: "250K+", icon: Users },
        { label: "Matches Daily", value: "12K+", icon: MonitorPlay },
        { label: "Prize Money", value: "$1M+", icon: Trophy },
        { label: "Avg Rating", value: "4.8★", icon: Star },
    ]

    return (
        <section className="py-24 bg-background border-t border-border relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

            <div className="container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-bold">Enter the Arena</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-8">
                            Ready to Start Your <span className="text-primary">Pro Journey?</span>
                        </h2>

                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                            Join the ultimate esports platform. Create your profile, find a team, and start competing today.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="p-4 bg-secondary/10 dark:bg-secondary/5 rounded-xl border border-border shadow-sm">
                                    <div className="text-center">
                                        <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-secondary flex items-center justify-center">
                                            <stat.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="text-xl font-bold font-heading text-foreground">{stat.value}</div>
                                        <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Link to="/register">
                            <button className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                <Rocket className="w-5 h-5" />
                                <span>Join Nexus Free</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>

                        <Link to="/esports/tournaments">
                            <button className="w-full sm:w-auto px-8 py-4 bg-secondary/20 border border-border hover:bg-secondary text-foreground font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                                <span>Browse Tournaments</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="group bg-secondary/10 rounded-2xl p-6 text-center border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                    <feature.icon className="w-6 h-6 text-foreground group-hover:text-primary-foreground" />
                                </div>
                                <div className="text-foreground font-bold mb-1">{feature.label}</div>
                                <div className="text-muted-foreground text-sm">{feature.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EsportsCTASection
