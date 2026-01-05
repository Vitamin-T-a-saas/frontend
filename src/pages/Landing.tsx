import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Target, TrendingUp } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Content",
      description: "Generate Instagram posts, carousels, reels, and email campaigns with AI assistance"
    },
    {
      icon: Target,
      title: "Brand DNA",
      description: "Create content that perfectly matches your brand voice and aesthetic"
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Track performance and understand what resonates with your audience"
    },
    {
      icon: Zap,
      title: "Smart Scheduling",
      description: "Plan and schedule your content calendar with drag-and-drop simplicity"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          animate={{
            backgroundPosition: ['center', 'center 10px', 'center'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"
            animate={{
              background: [
                'linear-gradient(to bottom, hsl(var(--background) / 0.8), hsl(var(--background) / 0.6), hsl(var(--background)))',
                'linear-gradient(to bottom, hsl(var(--primary) / 0.05), hsl(var(--background) / 0.6), hsl(var(--background)))',
                'linear-gradient(to bottom, hsl(var(--background) / 0.8), hsl(var(--background) / 0.6), hsl(var(--background)))',
              ]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div className="mb-8">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2
                }}
              >
                Vitamin T
              </motion.h1>
              <motion.p
                className="text-3xl md:text-4xl font-semibold text-foreground/80 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                Your AI Content Studio
              </motion.p>
            </motion.div>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Generate, analyze, and schedule Instagram and Email campaigns with the power of AI
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/brand-dna")}
                  className="text-lg px-8 py-6 rounded-full shadow-strong hover:shadow-medium transition-all relative overflow-hidden"
                >
                  <motion.span
                    animate={{
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Get Started
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete content studio designed for modern brands
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-background rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary to-purple-500 rounded-3xl p-12 text-center text-white shadow-strong"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Content?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join brands creating amazing content with AI
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/brand-dna")}
              className="text-lg px-8 py-6 rounded-full"
            >
              Start Your Journey
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
