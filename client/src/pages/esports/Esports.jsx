import { useEffect } from 'react';
import EsportsHero from '@/components/esports/home/EsportsHero';
import EsportsGamesSection from '@/components/esports/home/EsportsGamesSection';
import EsportsFeaturedTournaments from '@/components/esports/home/EsportsFeaturedTournaments';
import EsportsFeaturesSection from '@/components/esports/home/EsportsFeaturesSection';
import EsportsTestimonials from '@/components/esports/home/EsportsTestimonials';
import EsportsCTASection from '@/components/esports/home/EsportsCTASection';
import './esports.css';

const Esports = () => {

    useEffect(() => {
        document.title = "Esports - PLAYMEET";
    }, []);

    return (
        <div className="esports-theme min-h-screen bg-background text-foreground font-sans">
            {/* Hero Section */}
            <EsportsHero />

            {/* Games Categories */}
            <EsportsGamesSection />

            {/* Featured Tournaments */}
            <EsportsFeaturedTournaments />

            {/* Features Section */}
            <EsportsFeaturesSection />

            {/* Testimonials */}
            <EsportsTestimonials />

            {/* Call To Action */}
            <EsportsCTASection />
        </div>
    );
};

export default Esports;
