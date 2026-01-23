'use client';

import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnLinkedin = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      alert('Link copiado al portapapeles');
    }
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <span className="text-sm text-gray-500">Compartir:</span>
      <div className="flex gap-2">
        <button 
          onClick={shareOnFacebook}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          aria-label="Compartir en Facebook"
        >
          <Facebook size={18} />
        </button>
        <button 
          onClick={shareOnTwitter}
          className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
          aria-label="Compartir en Twitter"
        >
          <Twitter size={18} />
        </button>
        <button 
          onClick={shareOnLinkedin}
          className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
          aria-label="Compartir en LinkedIn"
        >
          <Linkedin size={18} />
        </button>
        <button 
          onClick={shareNative}
          className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Compartir"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
