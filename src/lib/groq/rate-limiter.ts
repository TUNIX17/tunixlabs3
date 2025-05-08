import { useState, useEffect, useCallback, useRef } from 'react';

// Hook simplificado para gestionar el estado de rate limiting basado en 'retry-after'
export const useRateLimiter = () => {
  // Almacena el timestamp (en ms) hasta el cual debemos esperar antes de reintentar.
  const [retryAfterTimestamp, setRetryAfterTimestamp] = useState<number>(0);
  const [canMakeRequest, setCanMakeRequest] = useState<boolean>(true);
  const [waitTime, setWaitTime] = useState<number>(0); // Tiempo de espera en milisegundos

  // Referencia para el temporizador, para poder limpiarlo
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const now = Date.now();
    if (now < retryAfterTimestamp) {
      setCanMakeRequest(false);
      const newWaitTime = retryAfterTimestamp - now;
      setWaitTime(newWaitTime);

      timerRef.current = setTimeout(() => {
        setCanMakeRequest(true);
        setWaitTime(0);
        // No reseteamos retryAfterTimestamp aquí, dejamos que una nueva llamada lo haga si falla.
      }, newWaitTime);

    } else {
      setCanMakeRequest(true);
      setWaitTime(0);
    }

    // Limpiar el temporizador al desmontar el componente o si cambia retryAfterTimestamp
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [retryAfterTimestamp]);

  // Función para ser llamada desde fuera (ej. desde useGroqConversation)
  // cuando se recibe un error 429 con una cabecera 'retry-after' (en segundos).
  const signalRateLimitHit = useCallback((retryAfterSeconds: number) => {
    if (retryAfterSeconds > 0) {
      const newRetryTimestamp = Date.now() + retryAfterSeconds * 1000;
      // Solo actualizar si el nuevo tiempo de espera es mayor que el actual
      // para evitar que una respuesta más rápida pise una espera más larga ya establecida.
      setRetryAfterTimestamp(prevTimestamp => Math.max(prevTimestamp, newRetryTimestamp));
    }
  }, []);

  // Esta función es ahora más optimista. El backend es el verdadero guardián.
  // Podría usarse para un control de spam muy básico en el cliente.
  const trackRequest = useCallback(() => {
    // Por ahora, esta función no hace mucho, pero la mantenemos por si se quiere añadir
    // lógica de cliente simple en el futuro (ej. no permitir >N requests en X segundos en el cliente).
    // console.log('Request tracked by client-side rate limiter.');
  }, []);

  return { 
    canMakeRequest, 
    waitTime, // Tiempo de espera actual en milisegundos
    trackRequest, 
    signalRateLimitHit // Nueva función para señalar un hit de rate limit
  };
};

// La función parseTimeString ya no es necesaria aquí si el backend pasa directamente el 'retry-after' en segundos.
// Si se necesitara parsear las cabeceras x-ratelimit-reset-*, debería hacerse en el backend
// o si el cliente las recibe y necesita interpretarlas. 