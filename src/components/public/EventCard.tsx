'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { Event } from "@/types/public";
import { motion } from "framer-motion";
import { useState } from "react";
import { publicAPI } from "@/lib/public-api";
import Link from "next/link";
import { format, parseISO } from "date-fns";

interface EventCardProps {
  event: Event;
  username?: string;
  showOrganizer?: boolean;
}

export function EventCard({ event, username, showOrganizer = true }: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLiked(!isLiked);
    try {
      await publicAPI.trackClick('event', event.id, username);
    } catch (error) {
      console.error('Failed to track like:', error);
    }
  };

  const handleGetTickets = async () => {
    setIsLoading(true);
    try {
      // Track the ticket interest
      await publicAPI.trackClick('event', event.id, username);
      
      // Here you would typically redirect to ticket purchase
      setTimeout(() => setIsLoading(false), 1000);
    } catch (error) {
      console.error('Failed to track ticket interest:', error);
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatEventTime = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'h:mm a');
    } catch {
      return '';
    }
  };

  const getEventStatus = () => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-green-500' };
    } else if (now >= startDate && now <= endDate) {
      return { status: 'live', label: 'Live', color: 'bg-red-500' };
    } else {
      return { status: 'ended', label: 'Ended', color: 'bg-gray-500' };
    }
  };

  const eventStatus = getEventStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <Link href={`/events/${event.slug}`}>
              <Image
                src={event.coverImage || '/placeholder-event.jpg'}
                alt={event.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Link>
            
            {/* Event Status Badge */}
            <Badge className={`absolute top-3 left-3 ${eventStatus.color} text-white`}>
              {eventStatus.label}
            </Badge>
            
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-cley-blue text-cley-blue' : 'text-gray-600'}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 space-y-3">
          {/* Organizer Info */}
          {showOrganizer && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-6 w-6 rounded-full bg-cley-lightBlue flex items-center justify-center">
                <span className="text-xs font-medium text-cley-blue">
                  {event.organizer.displayName.charAt(0)}
                </span>
              </div>
              <span>{event.organizer.displayName}</span>
            </div>
          )}
          
          {/* Title */}
          <Link href={`/events/${event.slug}`}>
            <CardTitle className="text-lg font-outfit line-clamp-2 hover:text-cley-blue transition-colors cursor-pointer">
              {event.title}
            </CardTitle>
          </Link>
          
          {/* Event Details */}
          <div className="space-y-2">
            {/* Date and Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatEventDate(event.startDate)}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{formatEventTime(event.startDate)}</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">
                {event.isOnline ? 'Online Event' : `${event.location.name}, ${event.location.city}`}
              </span>
            </div>
            
            {/* Capacity */}
            {event.capacity && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {event.soldTickets || 0} / {event.capacity} tickets
                </span>
              </div>
            )}
          </div>
          
          {/* Price and Get Tickets */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <p className="text-xl font-bold text-cley-blue">
                {formatPrice(event.ticketPrice || 0, event.currency)}
              </p>
              {event.capacity && event.soldTickets && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-cley-blue h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min((event.soldTickets / event.capacity) * 100, 100)}%` 
                    }}
                  />
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleGetTickets}
              disabled={isLoading || eventStatus.status === 'ended'}
              className="bg-cley-blue hover:bg-cley-blue/90 text-white"
              size="sm"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : eventStatus.status === 'ended' ? (
                'Ended'
              ) : (
                'Get Tickets'
              )}
            </Button>
          </div>
          
          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {event.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
