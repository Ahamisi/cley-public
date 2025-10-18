'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Eye, QrCode, Copy, Check } from "lucide-react";
import { User } from "@/types/public";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  user: User;
  onShare?: () => void;
  onLike?: () => void;
}

export function ProfileHeader({ user, onShare, onLike }: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    onLike?.();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${user.displayName} - Cleyverse Profile`,
        text: `Check out ${user.displayName}'s profile on Cleyverse`,
        url: window.location.href,
      });
    } else {
      handleCopyLink();
    }
    onShare?.();
  };

  return (
    <div className="text-center space-y-6 py-8 px-4">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-24 w-24 mx-auto ring-4 ring-cley-lightBlue">
          <AvatarImage 
            src={user.avatar} 
            alt={user.displayName}
            className="object-cover"
          />
          <AvatarFallback className="bg-cley-blue text-white text-xl font-outfit">
            {user.displayName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {user.verified && (
          <div className="absolute -bottom-1 -right-1 bg-cley-blue rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      
      {/* Name and Bio */}
      <div className="space-y-3">
        <h1 className="text-3xl font-outfit font-bold text-cley-blue">
          {user.displayName}
        </h1>
        {user.bio && (
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            {user.bio}
          </p>
        )}
        
        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {user.badges.map((badge) => (
              <Badge 
                key={badge} 
                variant="secondary" 
                className="bg-cley-lightBlue text-cley-blue border-cley-blue/20"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      {/* Stats and Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {/* Stats */}
        {user.stats && (
          <div className="flex gap-6 text-sm text-muted-foreground">
            {user.stats.views > 0 && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{user.stats.views.toLocaleString()} views</span>
              </div>
            )}
            {user.stats.likes > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{user.stats.likes.toLocaleString()} likes</span>
              </div>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            className={`${liked ? 'bg-cley-blue text-white border-cley-blue' : 'border-cley-blue text-cley-blue hover:bg-cley-blue hover:text-white'}`}
          >
            <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
            {liked ? 'Liked' : 'Like'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="border-cley-blue text-cley-blue hover:bg-cley-blue hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="border-cley-blue text-cley-blue hover:bg-cley-blue hover:text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
