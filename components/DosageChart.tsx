'use client';

import { Download, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DosageChart = () => {
    const dosageChartUrl = '/assets/altered-dosage-chart.pdf';

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = dosageChartUrl;
        link.download = 'Altered Dosage Chart.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleView = () => {
        window.open(dosageChartUrl, '_blank');
    };

    return (
        <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
            <div className="container mx-auto px-4">
                <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-glow animate-fade-in">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Icon Section */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                                    <div className="relative bg-primary/10 p-6 rounded-2xl">
                                        <FileText className="h-16 w-16 text-primary" />
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                                    <AlertCircle className="h-5 w-5 text-accent" />
                                    <span className="text-sm font-semibold text-accent uppercase tracking-wide">
                                        Important Information
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold mb-3">
                                    Altered Dosage Chart
                                </h2>
                                <p className="text-muted-foreground text-lg mb-6">
                                    Download our comprehensive dosage chart for detailed application guidelines and recommendations for optimal tire protection.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                                    <Button
                                        size="lg"
                                        onClick={handleDownload}
                                        className="bg-primary hover:bg-primary/90 gap-2"
                                    >
                                        <Download className="h-5 w-5" />
                                        Download PDF
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={handleView}
                                        className="gap-2 border-primary/20 hover:bg-primary/5"
                                    >
                                        <FileText className="h-5 w-5" />
                                        View Online
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 pt-6 border-t border-border">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span>Updated dosage recommendations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span>Vehicle-specific guidelines</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span>Professional application tips</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default DosageChart;
