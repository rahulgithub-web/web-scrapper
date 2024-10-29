"use client";

import { useState } from 'react';
import { Hotel } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ResortCard } from '@/components/ResortCard';
import { ScrapeForm } from '@/components/ScrapeForm';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [resorts, setResorts] = useState([]);
  const { toast } = useToast();

  const onSubmit = async (values: { location: string; propertyType: string }) => {
    try {
      setLoading(true);
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success!",
          description: `Scraped ${data.count} properties in ${values.location} successfully.`,
        });

        const resortsResponse = await fetch('/api/resorts');
        const resortsData = await resortsResponse.json();
        setResorts(resortsData);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to scrape properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <Hotel className="h-8 w-8 mr-2" />
          <h1 className="text-4xl font-bold text-center">Property Finder</h1>
        </div>

        <ScrapeForm onSubmit={onSubmit} loading={loading} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.map((resort: any) => (
            <ResortCard key={resort._id} resort={resort} />
          ))}
        </div>
      </div>
    </main>
  );
}