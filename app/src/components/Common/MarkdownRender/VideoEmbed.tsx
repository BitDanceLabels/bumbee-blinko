type VideoSource =
  | { type: 'iframe'; src: string; title: string }
  | { type: 'video'; src: string };

export const getVideoSource = (href: string): VideoSource | null => {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id ? { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}`, title: 'YouTube video' } : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = url.pathname.startsWith('/shorts/')
        ? url.pathname.split('/')[2]
        : url.searchParams.get('v');
      return id ? { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}`, title: 'YouTube video' } : null;
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = url.pathname.split('/').filter(Boolean).find(part => /^\d+$/.test(part));
      return id ? { type: 'iframe', src: `https://player.vimeo.com/video/${id}`, title: 'Vimeo video' } : null;
    }

    if (/\.(mp4|webm|ogg|mov)$/i.test(url.pathname)) {
      return { type: 'video', src: href };
    }
  } catch {
    return null;
  }

  return null;
};

export const VideoEmbed = ({ href }: { href: string }) => {
  const source = getVideoSource(href);
  if (!source) return null;

  if (source.type === 'video') {
    return <video className="w-full rounded-xl bg-black" src={source.src} controls preload="metadata" />;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: '16 / 9' }}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={source.src}
        title={source.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};
