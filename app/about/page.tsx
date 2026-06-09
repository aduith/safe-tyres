import React from 'react';
import { Shield, Droplet, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | SafeTyres',
  description: 'Learn more about SafeTyres, the premium tyre anti-puncture liquid solution.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          About SafeTyres
        </h1>
        
        <div className="space-y-8 text-lg text-muted-foreground leading-relaxed">
          <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p>
              At SafeTyres, our mission is to provide peace of mind to every driver on the road. 
              We understand the frustration, danger, and inconvenience of unexpected tyre punctures. 
              That's why we've engineered a premium anti-puncture liquid that acts proactively 
              to seal leaks before they ever become a problem.
            </p>
          </section>

          <section className="bg-card p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose Us?</h2>
            <p className="mb-6">
              Our advanced formula is the result of extensive research and testing. 
              It is designed to remain liquid inside your tyre, instantly coating and sealing punctures 
              as they occur, ensuring you reach your destination safely.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex gap-4">
                <Shield className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Ultimate Protection</h3>
                  <p className="text-sm">Seals punctures up to 6mm instantly and permanently.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Droplet className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Eco-Friendly Formula</h3>
                  <p className="text-sm">Safe for your tyres, rims, and the environment.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Long-Lasting</h3>
                  <p className="text-sm">Remains active for the entire legal life of your tyre.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Easy Application</h3>
                  <p className="text-sm">Simple to install in minutes without specialized tools.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-card p-8 rounded-2xl border border-border shadow-sm text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Join the Revolution</h2>
            <p className="mb-6">
              Don't let a flat tyre ruin your journey. Join thousands of satisfied drivers who 
              trust SafeTyres for their daily commutes and long-distance travels.
            </p>
            <Link 
              href="/products" 
              className="inline-block bg-primary text-primary-foreground font-medium px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Explore Our Products
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
