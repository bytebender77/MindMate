import { Brain, Sparkles, TrendingUp, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized reflections and emotional insights powered by advanced AI analysis'
    },
    {
      icon: TrendingUp,
      title: 'Track Your Mood',
      description: 'Visualize your emotional journey with beautiful charts and patterns over time'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your thoughts are private and secure. We protect your data with industry-leading encryption'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-xl opacity-70 animate-blob" style={{ animationDelay: '4s' }}></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Brain className="text-white" size={40} />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500">
              MindMate
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            Reflect, understand, and heal with your AI-powered emotional wellness companion
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="shadow-2xl"
            >
              <Sparkles size={20} />
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/insights')}
            >
              Learn More
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">10k+</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">1M+</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Journal Entries</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">4.9★</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Your Mental Wellness, Simplified
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to understand and improve your emotional well-being in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Ready to Begin?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
            Join thousands of people taking control of their emotional wellness journey
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="shadow-2xl"
          >
            <Brain size={20} />
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
