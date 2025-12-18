import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import Benefits from '../components/landing/Benefits';
import Testimonials from '../components/landing/Testimonials';
import Stats from '../components/landing/Stats';
import FAQ from '../components/landing/FAQ';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';
import { theme } from '../theme';

const LandingPage = () => {
    return (
        <div className="min-h-screen text-white font-sans" style={{ backgroundColor: theme.colors.dark }}>
            <Navbar />
            <Hero />
            <HowItWorks />
            <Benefits />
            <Stats />
            <Testimonials />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    );
};

export default LandingPage;
