import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosRequestConfig, ResponseType } from 'axios';

const GROQ_API_KEY = process.env.GROQ_API_KEY; // Debe estar configurada en tus variables de entorno del servidor
const GROQ_API_URL = 'https://api.groq.com/openai/v1';

interface ProxyRequestBody {
  endpoint: string;
  payload: any;
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE'; // Opcional, por defecto POST
  responseType?: ResponseType; // Opcional para especificar el tipo de respuesta esperada por axios
}

export async function POST(request: NextRequest) {
  if (!GROQ_API_KEY) {
    console.error("FATAL ERROR: La variable de entorno GROQ_API_KEY no está configurada en el servidor.");
    return NextResponse.json({ error: 'Error de configuración del servidor: clave API no encontrada.' }, { status: 500 });
  }

  try {
    const body = await request.json() as ProxyRequestBody;
    const { endpoint, payload, method = 'POST', responseType = 'json' } = body;

    // Lista blanca de endpoints permitidos para mayor seguridad
    const allowedEndpoints = ['/chat/completions', '/audio/speech', '/audio/transcriptions', '/models'];
    if (!allowedEndpoints.includes(endpoint)) {
      return NextResponse.json({ error: 'Endpoint no permitido a través del proxy.' }, { status: 403 });
    }

    const axiosConfig: AxiosRequestConfig = {
      method: method,
      url: `${GROQ_API_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: responseType,
    };

    if (method === 'POST' || method === 'PUT') {
      axiosConfig.data = payload;
    } else if (method === 'GET' && payload) {
      // Para GET, los parámetros suelen ir en la URL, pero si se envían como 'payload'
      // axios los puede usar en 'params'. Asumimos que 'payload' es un objeto para params.
      axiosConfig.params = payload;
    }
    
    const groqResponse = await axios(axiosConfig);

    if (responseType === 'arraybuffer' && endpoint === '/audio/speech') {
      // Para audio, devolver el buffer con el content-type correcto
      const headers = new Headers();
      headers.set('Content-Type', groqResponse.headers['content-type'] || 'audio/mpeg');
      return new NextResponse(groqResponse.data, { status: 200, statusText: 'OK', headers });
    }

    return NextResponse.json(groqResponse.data, { status: groqResponse.status });

  } catch (error: any) {
    console.error('Error en el proxy a Groq:', error.response?.data || error.message);
    const status = error.response?.status || 500;
    const errorData = error.response?.data || { message: 'Error interno del servidor al procesar la solicitud a Groq.' };
    
    // Si el error viene de Groq con una estructura específica, la reenviamos
    if (error.response?.data?.error) {
        return NextResponse.json({ error: error.response.data.error }, { status });
    }

    return NextResponse.json(
      { error: 'Error al procesar la solicitud a Groq.', details: errorData },
      { status }
    );
  }
}

// Podrías añadir también un método GET si necesitas exponer alguna funcionalidad GET del proxy
// export async function GET(request: NextRequest) { ... } 