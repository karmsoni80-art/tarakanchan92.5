import React from 'react';
import { Instagram, Sparkles, Heart } from 'lucide-react';

export const InstagramGallery: React.FC = () => {
  const posts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80',
      handle: '@tarakanchan.jewels',
      likes: '1,420',
      caption: 'Cocktail ring perfection in pure 92.5 solid silver ✨',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=500&q=80',
      handle: '@priya.bride',
      likes: '3,890',
      caption: 'The moment you wear royal peacock jhumkas on your sangeet night 🦚',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80',
      handle: '@vogue.india',
      likes: '5,120',
      caption: 'Modern regal elegance: The TARAKANCHAN Polki Choker editorial',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=500&q=80',
      handle: '@minimalist_tara',
      likes: '2,310',
      caption: 'Everyday sparkle that never tarnishes. 100% BIS Hallmarked.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#2B1921]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
            <Instagram className="w-3.5 h-3.5" />
            <span>#TARAKANCHAN925</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#F8F1F1] tracking-wide mb-2">
            Follow Our Atelier On Instagram
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm font-light">
            Tag @tarakanchan.jewels on Instagram to be featured on our global gallery.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-[#6F4C57]/40 shadow-lg cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-[#3E2630]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-[#F8F1F1]">
                <div className="flex items-center justify-between text-xs text-[#D4AF37]">
                  <span className="font-medium">{post.handle}</span>
                  <Instagram className="w-4 h-4" />
                </div>

                <p className="text-xs text-white line-clamp-3 font-light leading-snug">
                  {post.caption}
                </p>

                <div className="flex items-center space-x-1.5 text-xs text-rose-300">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{post.likes} loves</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
