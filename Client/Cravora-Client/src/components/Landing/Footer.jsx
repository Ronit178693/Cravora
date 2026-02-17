export default function Footer() {
    return (
        <footer className="landing-footer">
            <div className="landing-container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>Cravora</h3>
                        <p>Campus cravings, delivered fast. The all-in-one platform for food ordering, package delivery, and student earnings.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#how">How It Works</a></li>
                            <li><a href="#faq">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 Cravora. Built with ❤️ by students, for students.</p>
                    <div className="footer-socials">
                        <a href="#" className="footer-social" aria-label="Twitter">𝕏</a>
                        <a href="#" className="footer-social" aria-label="Instagram">📷</a>
                        <a href="#" className="footer-social" aria-label="LinkedIn">in</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
