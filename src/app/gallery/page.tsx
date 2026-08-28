import Image from 'next/image';

const galleryPhotos = [
  { url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80', caption: 'Playful puppies in our main lounge area.' },
  { url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80', caption: 'Luna resting by the window.' },
  { url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?w=600&auto=format&fit=crop&q=80', caption: 'Barista preparing double shot latte foam.' },
  { url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80', caption: 'Oliver sleeping on a comfortable rug.' },
  { url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80', caption: 'Bella playing inside our tunnel tubes.' },
  { url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80', caption: 'Coco sitting on a velvet chair.' }
];

export default function Gallery() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-lg mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-foreground">Café Gallery</h1>
        <p className="text-sm text-muted-foreground">
          Take a sneak peek inside our cozy lounge, peek at the cute animals, and see our delicious menu items.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {galleryPhotos.map((photo, i) => (
          <div key={i} className="glass-card rounded-2xl overflow-hidden border border-border p-3 flex flex-col space-y-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow">
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
                unoptimized
              />
            </div>
            <p className="text-xs text-muted-foreground font-medium text-center leading-relaxed">
              {photo.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
