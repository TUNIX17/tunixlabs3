import axios from 'axios';

// El cliente Axios ahora apuntará al proxy interno de Next.js
// Ya no manejará directamente la URL de Groq ni la API key.
export const apiClient = axios.create({
  // La URL base ahora es la de nuestro propio backend (API Route o Server Action)
  // Esto es un ejemplo, ajusta la URL si tu proxy está en otra ruta.
  baseURL: '/api/groq-proxy', 
  headers: {
    'Content-Type': 'application/json'
  }
});

// La función checkRateLimit como estaba concebida originalmente ya no es segura
// ni del todo correcta si se llama desde el cliente directamente a Groq.
// Debería ser manejada por el backend o, si se mantiene aquí, debería
// llamar a un endpoint seguro en el proxy que devuelva esta información.
// Por ahora, la comento para evitar su uso incorrecto.
/*
export const checkRateLimit = async () => {
  try {
    // Esta llamada ahora debería ir a través del proxy si se quiere mantener
    // una funcionalidad similar desde el cliente de forma segura.
    // Ejemplo: const response = await apiClient.post('', { endpoint: '/models', method: 'GET' });
    const response = await axios.get('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}` } // ¡Esto sigue siendo inseguro!
    });
    const headers = response.headers;
    
    return {
      remainingRequests: parseInt(headers['x-ratelimit-remaining-requests'] || '0'),
      remainingTokens: parseInt(headers['x-ratelimit-remaining-tokens'] || '0'),
      resetRequests: headers['x-ratelimit-reset-requests'],
      resetTokens: headers['x-ratelimit-reset-tokens']
    };
  } catch (error) {
    console.error('Error al verificar límites de tasa:', error);
    return null;
  }
}; 
*/

// Nueva función para verificar los límites de tasa a través del proxy (ejemplo)
// Esta es una forma más segura de hacerlo si necesitas esta info en el cliente.

interface ProxyRateLimitInfo {
  remainingRequests: number;
  remainingTokens: number;
  resetRequests: string; // o un tipo más específico si el proxy lo transforma
  resetTokens: string;   // o un tipo más específico si el proxy lo transforma
}

// Asumimos que la respuesta general del proxy podría contener estos datos
// directamente o anidados. Para el endpoint /models, podría ser algo así:
interface ProxyModelsResponse {
  // Aquí irían los datos que devuelve el endpoint /models de Groq
  models?: any[]; // Ejemplo, ajusta según la estructura real
  rateLimit?: ProxyRateLimitInfo; // La información de rate limit que añadiría tu proxy
}

export const checkRateLimitViaProxy = async (): Promise<ProxyRateLimitInfo | null> => {
  try {
    // Especificamos que esperamos una respuesta que coincida con ProxyModelsResponse
    const response = await apiClient.post<ProxyModelsResponse>('', { 
      endpoint: '/models', 
      method: 'GET' 
    });
    
    // Ahora TypeScript sabe que response.data puede tener una propiedad rateLimit
    if (response.data && response.data.rateLimit) {
      return response.data.rateLimit; 
    }
    
    // Ejemplo si necesitas leer cabeceras (requiere que el proxy las exponga correctamente via CORS y Axios configurado para accederlas)
    // const headers = response.headers;
    // if (headers && headers['x-ratelimit-remaining-requests']) { // Verificar que existan
    //   return {
    //     remainingRequests: parseInt(headers['x-ratelimit-remaining-requests'] || '0'),
    //     remainingTokens: parseInt(headers['x-ratelimit-remaining-tokens'] || '0'),
    //     resetRequests: headers['x-ratelimit-reset-requests'] || '',
    //     resetTokens: headers['x-ratelimit-reset-tokens'] || ''
    //   };
    // }

    console.warn('checkRateLimitViaProxy: El proxy no devolvió información de rate limit en el formato esperado o las cabeceras no estaban disponibles.');
    return null;
  } catch (error) {
    console.error('Error al verificar límites de tasa a través del proxy:', error);
    return null;
  }
}; 