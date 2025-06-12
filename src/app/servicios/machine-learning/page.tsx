import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FiArrowLeft, FiActivity, FiSettings, FiBarChart2, FiDatabase, FiRefreshCcw, FiMessageCircle } from 'react-icons/fi';

const MachineLearningPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center pt-20 pb-16">
      <Head>
        <title>Machine Learning - TunixLabs</title>
        <meta name="description" content="Implementamos modelos predictivos que aprenden de tus datos para automatizar procesos y mejorar la eficiencia operativa." />
        <meta name="keywords" content="machine learning, aprendizaje automático, modelos predictivos, inteligencia artificial, automatización, eficiencia, datos, IA, TunixLabs" />
        <meta property="og:title" content="Machine Learning - TunixLabs" />
        <meta property="og:description" content="Implementamos modelos predictivos que aprenden de tus datos para automatizar procesos y mejorar la eficiencia operativa." />
        <meta property="og:url" content="https://www.tunixlabs.com/servicios/machine-learning" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.tunixlabs.com/servicios/machine-learning" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Link href="/inicio" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-8">
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Volver a Servicios
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Machine Learning Empresarial
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Soluciones de machine learning a medida para potenciar tu negocio. Desarrollamos modelos predictivos, segmentación y optimización adaptados a tus necesidades. Gestionamos el ciclo completo (datos, entrenamiento, despliegue y monitoreo) con prácticas MLOps y resultados cuantificables.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-indigo-500 pb-2">¿Qué ofrecemos?</h2>
          <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-12 animate-fade-in-up">
            Soluciones de machine learning a medida: modelos predictivos, automatización y optimización de procesos para tu negocio.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiActivity className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Modelos Predictivos Personalizados</h3>
              <p className="text-gray-700 dark:text-gray-300">Anticipa tendencias, demanda y comportamientos con modelos hechos a tu medida.</p>
            </div>
            {/* Card 2 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiSettings className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Automatización de Procesos</h3>
              <p className="text-gray-700 dark:text-gray-300">Sistemas de ML que automatizan tareas repetitivas y optimizan recursos.</p>
            </div>
            {/* Card 3 */}
            <div className="group bg-white/90 dark:bg-gray-800/90 border border-indigo-100 dark:border-indigo-900 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up">
              <FiBarChart2 className="h-10 w-10 text-indigo-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-indigo-700 dark:text-indigo-300">Detección de Anomalías y Optimización</h3>
              <p className="text-gray-700 dark:text-gray-300">Identifica fraudes, patrones inusuales y mejora la eficiencia operativa.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiSettings className="h-6 w-6 text-yellow-500 mr-3" />
              Aplicaciones Comunes
            </h3>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2">
              <li><span className="font-semibold text-yellow-600 dark:text-yellow-400">Comercio Electrónico:</span> Recomendaciones personalizadas de productos, optimización de precios en tiempo real y análisis de comportamiento de compra.</li>
              <li><span className="font-semibold text-yellow-600 dark:text-yellow-400">Detección de Fraude:</span> Identificación de transacciones sospechosas y patrones anómalos en tiempo real para prevenir fraudes financieros y ciberataques.</li>
              <li><span className="font-semibold text-yellow-600 dark:text-yellow-400">Mantenimiento Predictivo:</span> Anticipación de fallas en maquinaria y equipos industriales mediante el análisis de datos de sensores.</li>
              <li><span className="font-semibold text-yellow-600 dark:text-yellow-400">Optimización de la Cadena de Suministro:</span> Predicción de la demanda de productos, optimización de rutas de entrega y gestión de inventarios para reducir costes y mejorar la eficiencia.</li>
              <li><span className="font-semibold text-yellow-600 dark:text-yellow-400">Atención al Cliente:</span> Implementación de chatbots inteligentes para soporte 24/7, clasificación de consultas y mejora de la satisfacción del cliente.</li>
              <li><span className="font-semibold text-yellow-600 dark:text-yellow-400">Análisis de Sentimiento:</span> Procesamiento de lenguaje natural para analizar opiniones en redes sociales y comentarios de clientes, obteniendo insights sobre la percepción de la marca.</li>
              <li><span className="font-semibold text-yellow-600 dark:text-yellow-400">Recursos Humanos:</span> Predicción de rotación de personal, preselección de candidatos y análisis del desempeño para mejorar la retención de talento.</li>
              <li><span className="font-semibold text-yellow-600 dark:text-yellow-400">Diagnóstico Médico Asistido por IA:</span> Análisis de imágenes médicas y registros de pacientes para apoyar diagnósticos tempranos y planes de tratamiento.</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiDatabase className="h-6 w-6 text-green-500 mr-3" />
              Tecnologías Clave
            </h3>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-300 space-y-2">
              <li>TensorFlow y PyTorch para aprendizaje profundo.</li>
              <li>Scikit-learn para machine learning clásico.</li>
              <li>Keras y OpenCV para visión por computadora.</li>
              <li>NLTK y SpaCy para procesamiento de lenguaje natural.</li>
              <li>Plataformas en la nube: AWS Sagemaker, Google AI Platform, Azure ML.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b-2 border-indigo-500 pb-2">Nuestro Enfoque</h2>
          <ol className="list-decimal list-inside text-lg text-gray-700 dark:text-gray-300 space-y-3">
            <li><span className="font-semibold text-indigo-600 dark:text-indigo-400">Definición del Problema y Recopilación de Datos:</span> Entendemos tus objetivos y recopilamos los datos necesarios para el entrenamiento del modelo.</li>
            <li><span className="font-semibold text-indigo-600 dark:text-indigo-400">Preprocesamiento y Exploración de Datos:</span> Limpiamos, transformamos y analizamos tus datos para asegurar su calidad y relevancia.</li>
            <li><span className="font-semibold text-indigo-600 dark:text-indigo-400">Diseño y Entrenamiento de Modelos:</span> Seleccionamos los algoritmos adecuados y entrenamos modelos robustos y eficientes.</li>
            <li><span className="font-semibold text-indigo-600 dark:text-indigo-400">Evaluación y Optimización:</span> Validamos el rendimiento del modelo y lo ajustamos para lograr la máxima precisión y eficiencia.</li>
            <li><span className="font-semibold text-indigo-600 dark:text-indigo-400">Implementación y Monitoreo:</span> Desplegamos el modelo en tu entorno de producción y lo monitoreamos continuamente para asegurar su rendimiento óptimo.</li>
          </ol>
        </div>

        <div className="text-center mt-12">
          <Link href="/contacto" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 neon-border md:py-5 md:text-lg md:px-10 transition-all duration-300">
            <FiMessageCircle className="h-6 w-6 mr-3" />
            Optimiza tus operaciones con Machine Learning
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MachineLearningPage; 