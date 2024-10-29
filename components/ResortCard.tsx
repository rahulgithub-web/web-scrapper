"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Resort {
  _id: string;
  imgSrc: string;
  name: string;
  address: string;
  description: string;
  amenities: string[];
  rating: number;
  price: number;
  reviewsCount: number;
}

export function ResortCard({ resort }: { resort: Resort }) {
  return (
    <Card className="overflow-hidden">
      <img
        src={resort.imgSrc}
        alt={resort.name}
        className="w-full h-48 object-cover"
      />
      <CardHeader>
        <CardTitle className="text-xl">{resort.name}</CardTitle>
        <CardDescription>{resort.address}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{resort.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="ml-1">{resort.rating}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({resort.reviewsCount} reviews)
            </span>
          </div>
          <div className="text-lg font-semibold">
            ₹{resort.price}/night
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {resort.amenities.slice(0, 3).map((amenity: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 rounded-full text-xs"
            >
              {amenity}
            </span>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}