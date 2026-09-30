const ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extrae el ID de 11 caracteres de cualquier enlace de YouTube (watch, youtu.be, shorts,
 * live, embed, m.youtube) o de un ID suelto. Devuelve null si no es un video válido.
 */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (ID_PATTERN.test(value)) return value;
  let url: URL;
  try {
    url = new URL(value.startsWith('http') ? value : `https://${value}`);
  } catch {
    return null; // no es una URL: la persona pegó otra cosa
  }
  const host = url.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let candidate: string | null | undefined = null;
  if (host === 'youtu.be') {
    candidate = url.pathname.split('/')[1];
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, first, second] = url.pathname.split('/');
    candidate =
      first === 'watch'
        ? url.searchParams.get('v')
        : ['embed', 'shorts', 'live', 'v'].includes(first ?? '')
          ? second
          : null;
  }
  return candidate && ID_PATTERN.test(candidate) ? candidate : null;
}

export function youTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function youTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
