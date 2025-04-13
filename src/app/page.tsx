export default function Home() {
  // Esta función se ejecuta en el cliente
  if (typeof window !== 'undefined') {
    window.location.href = '/inicio';
  }

  return null;
} 