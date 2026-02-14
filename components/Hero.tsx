'use client';

import { Button } from '@/components/ui/button';
import { Shield, Droplet, Star } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(/assets/hero-banner.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Animated glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center space-y-2 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>Premium Protection for Your Tyres</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-liquid-flow">
              Tyre Anti-Puncture
            </span>
            <br />
            <span className="text-foreground">Liquid Solution</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced liquid protection that seals punctures instantly. Drive with confidence knowing your tyres are protected from flats and leaks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-glow text-lg px-8">
                Shop Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Learn More
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {[
              { icon: Droplet, title: 'Instant Sealing', desc: 'Seals punctures up to 6mm instantly' },
              { icon: Shield, title: 'Long-Lasting', desc: 'Protection lasts for the life of the tyre' },
              { icon: Star, title: 'Easy to Use', desc: 'Simple application, no tools required' },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
