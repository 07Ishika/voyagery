import { Separator } from "@/components/ui/separator";
import { Heart, Globe, Award, Code, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Voyagery
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting aspiring migrants with verified local guides worldwide for 1:1 mentorship and AI-driven cost-of-living analysis.
            </p>
            <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Avishkar 2025 Zonal Round Selection</span>
            </div>
          </div>

          {/* For Migrants */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">For Migrants</h3>
            <div className="space-y-2 text-sm">
              <Link to="/guides" className="block text-muted-foreground hover:text-primary transition-colors">
                Find Local Guides
              </Link>
              <Link to="/cost-of-living" className="block text-muted-foreground hover:text-primary transition-colors">
                Costlytic Engine
              </Link>
              <Link to="/community" className="block text-muted-foreground hover:text-primary transition-colors">
                Community Forum
              </Link>
              <Link to="/dashboard-migrant" className="block text-muted-foreground hover:text-primary transition-colors">
                Migrant Dashboard
              </Link>
            </div>
          </div>

          {/* For Guides */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">For Guides</h3>
            <div className="space-y-2 text-sm">
              <Link to="/dashboard-guide" className="block text-muted-foreground hover:text-primary transition-colors">
                Guide Dashboard
              </Link>
              <Link to="/migrant-requests" className="block text-muted-foreground hover:text-primary transition-colors">
                Incoming Requests
              </Link>
              <Link to="/guide/profile" className="block text-muted-foreground hover:text-primary transition-colors">
                Guide Profile Settings
              </Link>
              <Link to="/role" className="block text-muted-foreground hover:text-primary transition-colors">
                Role Selection
              </Link>
            </div>
          </div>

          {/* Platform Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">MVP Architecture</h3>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-primary shrink-0" />
                <span>React 18 • Node.js • Express • MongoDB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-secondary shrink-0" />
                <span>AI Insights powered by Groq Llama 3.3</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-accent shrink-0" />
                <span>Hosted on Vercel & Render</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()} Voyagery. Full-Stack MERN Project MVP.
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for global citizens & migrants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
