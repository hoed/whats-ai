
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Bot, PieChart, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-purple-900/30"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>
        
        {/* Grid background */}
        <div className="absolute inset-0" 
          style={{ 
            backgroundImage: 'linear-gradient(rgba(66, 71, 112, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(66, 71, 112, 0.1) 1px, transparent 1px)', 
            backgroundSize: '30px 30px',
            perspective: '1000px',
            transform: 'rotateX(60deg) scale(4) translateZ(-10px)',
            transformOrigin: 'center bottom',
            backgroundPosition: 'center center'
          }}>
        </div>
        
        {/* Animated glow orbs */}
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '3.5s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center">
          <Bot className="w-8 h-8 text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AIConverse
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-sm text-gray-300 hover:text-white transition">Login</Link>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            onClick={() => navigate('/auth')}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <main className="relative z-10">
        <section className="py-28 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight">
                <span className="block">Advanced</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AI-Powered</span>
                <span className="block">Customer Service</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-lg">
                Seamlessly integrate WhatsApp with AI to deliver exceptional customer experiences that feel human, respond instantly, and build lasting relationships.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-8 py-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-lg">
                  Start Free Trial
                </Button>
                <Button variant="outline" className="rounded-full px-8 py-6 border-gray-700 hover:border-gray-500 text-lg">
                  Watch Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex gap-8 pt-8">
                <div>
                  <p className="text-3xl font-bold text-blue-400">98%</p>
                  <p className="text-sm text-gray-400">Customer satisfaction</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">24/7</p>
                  <p className="text-sm text-gray-400">Customer support</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">5min</p>
                  <p className="text-sm text-gray-400">Average setup time</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3 text-sm">
                      Hi! I'm having issues with my recent order #45678. Can you help?
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm rounded-2xl rounded-tr-none p-3 text-sm">
                      Hi there! I'm sorry to hear about the issue with your order #45678. I can see that your package is currently in transit and scheduled for delivery tomorrow. Would you like me to send you the tracking link?
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0"></div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-none p-3 text-sm">
                      Yes, please! That would be helpful.
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-600/50 to-purple-600/50 backdrop-blur-sm rounded-2xl rounded-tr-none p-3 text-sm">
                      Here's your tracking link: https://track.delivery/85f4e2
                      <br /><br />Is there anything else I can help you with today?
                    </div>
                  </div>
                </div>
                
                {/* Glowing lines */}
                <div className="absolute top-0 left-10 w-[1px] h-full bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0"></div>
                <div className="absolute top-32 right-12 w-[1px] h-32 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Future of Customer Support
            </h2>
            <p className="text-gray-400">Our AI-powered WhatsApp integration delivers personalized, intelligent customer service that scales with your business.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Phone className="h-8 w-8 text-blue-400" />,
                title: "WhatsApp Integration",
                description: "Connect directly with customers on their preferred messaging platform without any additional apps or software."
              },
              {
                icon: <Bot className="h-8 w-8 text-indigo-400" />,
                title: "AI Personalities",
                description: "Create custom AI profiles tailored to your brand voice and customer service needs."
              },
              {
                icon: <MessageCircle className="h-8 w-8 text-purple-400" />,
                title: "Reusable Templates",
                description: "Save time with message templates for common inquiries while maintaining a personalized touch."
              },
              {
                icon: <Bot className="h-8 w-8 text-cyan-400" />,
                title: "Knowledge Training",
                description: "Train AI with company knowledge to provide accurate, consistent information to customers."
              },
              {
                icon: <PieChart className="h-8 w-8 text-pink-400" />,
                title: "Analytics Dashboard",
                description: "Gain insights into customer interactions with comprehensive analytics and performance metrics."
              },
              {
                icon: <MessageCircle className="h-8 w-8 text-blue-400" />,
                title: "Voice Support",
                description: "Offer natural voice conversations powered by ElevenLabs for an enhanced customer experience."
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="p-3 bg-gray-800/50 rounded-lg w-fit mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900/70 backdrop-blur-md p-12 rounded-2xl border border-gray-800">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Ready to transform your customer service?</h2>
                  <p className="text-gray-400 mb-6">Start building stronger customer relationships with AI-powered conversations today.</p>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-8 py-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-lg">
                    Get Started Now
                  </Button>
                </div>
                <div className="hidden md:block relative">
                  <div className="absolute w-20 h-20 rounded-full bg-blue-500/30 blur-xl -top-10 -left-10 animate-pulse"></div>
                  <div className="absolute w-24 h-24 rounded-full bg-purple-500/30 blur-xl -bottom-10 -right-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                  <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Total Conversations</h4>
                        <p className="text-2xl font-bold text-white">3,257</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/10 p-3 rounded-lg">
                        <MessageCircle className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-3/4 rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-gray-500">0</span>
                      <span className="text-blue-400">75%</span>
                      <span className="text-gray-500">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="relative z-10 py-10 px-6 border-t border-gray-800/50 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Bot className="w-6 h-6 text-blue-400 mr-2" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              AIConverse
            </h1>
          </div>

          <div className="mt-6 md:mt-0 text-sm text-gray-500">
            &copy; 2025 Hoed - AIConverse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
