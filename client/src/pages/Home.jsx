import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ServiceCards from '../components/ServiceCards';
import HowItWorks from '../components/HowItWorks';
import WhyChooseConsultation from '../components/WhyChooseConsultation';
import ServicesSection from '../components/ServicesSection';
import BookingForm from '../components/BookingForm';
import axios from 'axios';
import BrandsGrid from '../components/BrandsGrid';

const Home = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('/api/');
                if (res.data.success) {
                    setServices(res.data.services);
                }
            } catch (err) {
                console.error('Failed to fetch services', err);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="home-page">
            <HeroSection />
            <ServiceCards />
            <HowItWorks />
            <WhyChooseConsultation />
            <ServicesSection services={services} />
            <BrandsGrid />
            <BookingForm />
        </div>
    );
};

export default Home;
