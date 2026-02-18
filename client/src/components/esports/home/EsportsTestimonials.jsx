import { useState } from 'react'
import {
    Star,
    Quote,
    CheckCircle,
} from 'lucide-react'

const EsportsTestimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: "Alex 'Viper' Chen",
            role: "Valorant IGL",
            content: "Finding quality scrims used to take hours. With Playmeet, my team is matched instantly with opponents of our skill level. It's a game changer.",
            image: "https://i.pravatar.cc/150?u=4"
        },
        {
            id: 2,
            name: "Marcus Jordan",
            role: "Tournament Org",
            content: "Hosting our monthly CS2 ladder has never been easier. The automated brackets and result tracking save us so much admin time.",
            image: "https://i.pravatar.cc/150?u=5"
        },
        {
            id: 3,
            name: "Elena Rodriguez",
            role: "Pro LoL Player",
            content: "I found my current team through the recruitment features here. The profile stats helped me showcase my champion pool effectively.",
            image: "https://i.pravatar.cc/150?u=6"
        },
    ]

    return (
        <section className="py-24 bg-background relative overflow-hidden text-foreground">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-6">
                        <Quote className="w-4 h-4" />
                        <span className="text-sm font-bold">Player Stories</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-6">
                        Trusted by the <span className="text-primary">Community</span>
                    </h2>
                    <p className="text-base text-muted-foreground">
                        Join thousands of gamers who have elevated their play through our platform.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-secondary/10 p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group relative"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-8 text-primary/10 group-hover:text-primary/20 transition-colors">
                                <Quote className="w-12 h-12" />
                            </div>
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            {/* Content */}
                            <p className="text-muted-foreground mb-8 relative z-10 leading-relaxed">
                                "{testimonial.content}"
                            </p>
                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-secondary p-1 border border-border">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-foreground">{testimonial.name}</div>
                                    <div className="text-sm text-primary">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-12 text-xs text-gray-500 dark:text-gray-400 opacity-80">
                    Note: These testimonials are simulated for the demo.
                </div>
            </div>
        </section>
    )
}

export default EsportsTestimonials
