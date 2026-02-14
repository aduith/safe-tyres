'use client';

import { Shield, Droplet, Clock, Leaf, Award, Wrench } from 'lucide-react';

const ProductAdvantages = () => {
  const advantages = [
    {
      icon: Shield,
      title: 'Maximum Protection',
      description: 'Seals punctures up to 6mm instantly, preventing air loss and keeping you on the road.',
    },
    {
      icon: Clock,
      title: 'Long-Lasting Formula',
      description: 'Works for the entire life of your tyre without needing reapplication.',
    },
    {
      icon: Droplet,
      title: 'Prevents Slow Leaks',
      description: 'Stops slow punctures before they become a problem, saving time and money.',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Non-toxic, water-based formula that is safe for tyres and the environment.',
    },
    {
      icon: Award,
      title: 'Professional Grade',
      description: 'Trusted by mechanics and professionals worldwide for reliable performance.',
    },
    {
      icon: Wrench,
      title: 'Universal Compatibility',
      description: 'Works with all tyre types: cars, motorcycles, bicycles, and more.',
    },
  ];

  

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            Why Choose <span className="text-primary">SafeTyres</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the benefits that make our anti-puncture liquid the best choice for your vehicle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4">
                <advantage.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{advantage.title}</h3>
              <p className="text-muted-foreground">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductAdvantages;
