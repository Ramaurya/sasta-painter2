import React from 'react';
import { Link } from 'react-router-dom';
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaWhatsapp
} from 'react-icons/fa';
import './footer.css';

const Footer = () => {

    // Quick Links Data
    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Why Us', path: '/why-us' },
        { name: 'Book Site Visit', path: '/book' },
        { name: 'Login / Register', path: '/login' }
    ];

    // Services Data
    const servicesLinks = [
        { name: 'Interior Painting', path: '/services/Interior-Painting' },
        { name: 'Exterior Painting', path: '/services/Exterior-Painting' },
        { name: 'Rental Painting', path: '/services/Rental-Painting' },
        { name: 'Waterproofing', path: '/services/Waterproofing' },
        { name: 'Wood Finishes', path: '/services/Wood-Finishes' },
        { name: 'Texture Painting', path: '/services/Texture-Painting' }
    ];

    // Cities Data
    const cities = [
        'Delhi', 'Noida'
    ];

    return (
        <footer className="footer" id="contact">
            <div className="footer-container">
                <div className="footer-grid">

                    {/* Column 1: Brand Info */}
                    <div className="footer-col">
                        <Link to="/" className="footer-logo">
                            Aapka<span>Painter</span>
                        </Link>
                        <p>
                            We provide premium painting and waterproofing services across Delhi & NCR.
                            Our expert painters deliver quality finishes, timely completion, and a hassle-free experience.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}><Link to={link.path}>{link.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Our Services */}
                    <div className="footer-col">
                        <h4>Our Services</h4>
                        <ul className="footer-links">
                            {servicesLinks.map((link, idx) => (
                                <li key={idx}><Link to={link.path}>{link.name}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Cities */}
                    <div className="footer-col">
                        <h4>We Serve In</h4>
                        <ul className="footer-links">
                            {cities.map((city, idx) => (
                                <li key={idx}><span style={{ color: '#cbd5e1' }}>{city}</span></li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 5: Contact & Social */}
                    <div className="footer-col">
                        <h4>Contact Us</h4>
                        <div className="contact-item">
                            <FaPhone className="contact-icon" />
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <span>hello@aapkapainter.clone</span>
                        </div>
                        <div className="contact-item">
                            <FaMapMarkerAlt className="contact-icon" />
                            <span>Delhi & Noida</span>
                        </div>

                        <div className="social-links">
                            <a href="#" className="social-icon"><FaFacebookF /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaYoutube /></a>
                            <a href="#" className="social-icon"><FaLinkedinIn /></a>
                            <a href="#" className="social-icon"><FaWhatsapp /></a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>&copy; 2025 AapkaPainter. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms-and-conditions">Terms & Conditions</Link>
                        <Link to="/refund-policy">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
