'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowUpRight, Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { SocialLink } from "@/types/public";
import { useState } from "react";
import { publicAPI } from "@/lib/public-api";

interface LinkGridProps {
  links: SocialLink[];
  username: string;
}

export function LinkGrid({ links, username }: LinkGridProps) {
  const [clickedLinks, setClickedLinks] = useState<Set<string>>(new Set());

  const handleLinkClick = async (link: any) => {
    // Track the click using the correct API structure
    try {
      if (link.type === 'link') {
        await publicAPI.trackClick('link', link.id, username);
      } else if (link.platform) {
        await publicAPI.trackClick('socialLink', link.id, username);
      }
    } catch (error) {
      console.error('Failed to track click:', error);
    }

    // Add visual feedback
    setClickedLinks(prev => new Set(prev).add(link.id));
    setTimeout(() => {
      setClickedLinks(prev => {
        const newSet = new Set(prev);
        newSet.delete(link.id);
        return newSet;
      });
    }, 200);

    // Open link
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getPlatformIcon = (link: any) => {
    // Handle both regular links and social links
    const platform = link.platform || link.type || 'website';
    
    const platformIcons: Record<string, string> = {
      instagram: '📷',
      twitter: '🐦',
      facebook: '📘',
      linkedin: '💼',
      youtube: '📺',
      tiktok: '🎵',
      pinterest: '📌',
      snapchat: '👻',
      discord: '💬',
      twitch: '🎮',
      spotify: '🎵',
      apple: '🍎',
      google: '🔍',
      github: '💻',
      website: '🌐',
      link: '🔗',
    };
    
    return platformIcons[platform.toLowerCase()] || '🔗';
  };

  const getPlatformColor = (link: any) => {
    const platform = link.platform || link.type || 'website';
    
    const platformColors: Record<string, string> = {
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
      twitter: 'bg-blue-400',
      facebook: 'bg-blue-600',
      linkedin: 'bg-blue-700',
      youtube: 'bg-red-600',
      tiktok: 'bg-black',
      pinterest: 'bg-red-500',
      snapchat: 'bg-yellow-400',
      discord: 'bg-indigo-600',
      twitch: 'bg-purple-600',
      spotify: 'bg-green-500',
      website: 'bg-cley-blue',
      link: 'bg-cley-blue',
    };
    
    return platformColors[platform.toLowerCase()] || 'bg-cley-blue';
  };

  if (!links || links.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No links available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 max-w-md mx-auto px-4">
      {links
        .filter(link => link.isActive)
        .sort((a, b) => a.order - b.order)
        .map((link, index) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`group hover:shadow-lg transition-all duration-300 hover:scale-105 ${
              clickedLinks.has(link.id) ? 'scale-95' : ''
            }`}>
              <CardContent className="p-0">
                <Button 
                  onClick={() => handleLinkClick(link)}
                  className={`w-full h-16 text-white border-0 rounded-lg relative overflow-hidden ${
                    getPlatformColor(link)
                  } hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center justify-between w-full px-6">
                    <div className="flex items-center gap-4">
                      {link.icon ? (
                        <img 
                          src={link.icon} 
                          alt={link.title}
                          className="h-8 w-8 rounded-full bg-white/20 p-1"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                          {getPlatformIcon(link)}
                        </div>
                      )}
                      <span className="font-medium text-lg">{link.title}</span>
                    </div>
                    <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
    </div>
  );
}
