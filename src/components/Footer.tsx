
import { Link } from "react-router-dom";

const Footer = () => {
  const socialIcons = [
    { name: "LinkedIn", url: "#", icon: "💼" },
    { name: "Instagram", url: "#", icon: "📸" }, 
    { name: "Facebook", url: "#", icon: "📘" },
    { name: "X (Twitter)", url: "#", icon: "🐦" },
    { name: "Pinterest", url: "#", icon: "📌" }
  ];

  const footerLinks = [
    { name: "About", url: "/about" },
    { name: "Contact", url: "/contact" },
    { name: "Terms", url: "/terms" },
    { name: "Privacy", url: "/privacy" },
    { name: "Login", url: "/login" },
    { name: "Sign Up", url: "/signup" }
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-fabel-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold">Fabel</span>
            </div>
            <p className="text-background/80 leading-relaxed mb-6">
              AI-powered social marketing platform designed to help small businesses grow through intelligent, persona-based content creation and scheduling.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a 
                  key={index}
                  href={social.url}
                  className="text-2xl hover:scale-110 transition-transform duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {footerLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.url}
                  className="text-background/80 hover:text-fabel-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Stay Updated</h3>
            <p className="text-background/80 mb-6">
              Get the latest tips and updates on AI-powered marketing for small businesses.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg border-0 text-foreground"
              />
              <button className="bg-fabel-primary hover:bg-fabel-primary/90 px-6 py-3 rounded-r-lg text-white transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 text-center">
          <p className="text-background/60">
            © 2024 Fabel. All rights reserved. Built with ❤️ for small businesses.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
