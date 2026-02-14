'use client';

import { CheckCircle } from 'lucide-react';

const UsageInstructions = () => {
  const steps = [
    {
      step: '1',
      title: 'Remove Valve Core',
      description: 'Using a valve core removal tool, carefully unscrew and remove the valve core from your tyre.',
    },
    {
      step: '2',
      title: 'Shake Well',
      description: 'Shake the SafeTyres bottle vigorously for 10-15 seconds to ensure the liquid is properly mixed.',
    },
    {
      step: '3',
      title: 'Inject the Liquid',
      description: 'Attach the bottle to the valve stem and inject the recommended amount based on your tyre size.',
    },
    {
      step: '4',
      title: 'Reinstall Valve Core',
      description: 'Screw the valve core back into place securely using the valve core removal tool.',
    },
    {
      step: '5',
      title: 'Inflate Tyre',
      description: 'Inflate your tyre to the recommended pressure as specified by your vehicle manufacturer.',
    },
    {
      step: '6',
      title: 'Distribute Evenly',
      description: 'Drive for 1-2 miles to distribute the liquid evenly inside the tyre for optimal protection.',
    },
  ];

  const recommendations = [
    '200ml for bicycles and small motorcycles',
    '300ml for motorcycles and compact cars',
    '500ml for standard cars and SUVs',
    '1L for large vehicles and trucks',
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4">
            How to <span className="text-primary">Use SafeTyres</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Follow these simple steps to protect your tyres from punctures.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Steps */}
          <div className="space-y-6 mb-12">
            {steps.map((item, index) => (
              <div
                key={index}
                className="flex gap-6 p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations */}
          <div className="p-8 rounded-2xl bg-card/50 border border-border">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="text-primary" />
              Recommended Amounts
            </h3>
            <ul className="space-y-4">
              {recommendations.map((rec, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                >
                  <span className="text-primary mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageInstructions;
