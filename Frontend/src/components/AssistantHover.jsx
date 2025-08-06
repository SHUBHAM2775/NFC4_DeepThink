import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { getChatGuidance } from '../services/voiceLogAPI';

const AssistantHover = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t('assistant.welcomeMessage', 'Hello! I am your AI pregnancy assistant. How can I help you today?'),
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiServiceStatus, setAiServiceStatus] = useState('unknown');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Get AI response from backend
  const getAIResponse = async (userMessage) => {
    try {
      const userId = user?.id || user?.userId || '64cbe981e458d243b5c1e7ab';
      const currentLanguage = i18n.language !== 'en' ? i18n.language : null;
      
      const response = await getChatGuidance(userMessage, userId, currentLanguage);
      
      setAiServiceStatus(response.aiServiceAvailable ? 'available' : 'fallback');
      
      return response.aiGuidance || 'I apologize, but I could not process your request at the moment. Please try again.';
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setAiServiceStatus('error');
      
      // Fallback to predefined responses
      return getPredefinedResponse(userMessage);
    }
  };

  // Predefined responses as fallback
  const getPredefinedResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('pain') || message.includes('hurt')) {
      return t('assistant.responses.pain', 'For any severe pain, please contact your doctor immediately. Mild discomfort can be normal during pregnancy.');
    }
    
    if (message.includes('medicine') || message.includes('medication') || message.includes('tablet')) {
      return t('assistant.responses.medication', 'Please consult your doctor before taking any medication during pregnancy.');
    }
    
    if (message.includes('diet') || message.includes('food') || message.includes('eat')) {
      return t('assistant.responses.diet', 'Eat a balanced diet rich in fruits, vegetables, whole grains, and lean proteins. Avoid raw fish, unpasteurized dairy, and limit caffeine.');
    }
    
    if (message.includes('exercise') || message.includes('yoga') || message.includes('walk')) {
      return t('assistant.responses.exercise', 'Gentle exercise like walking, swimming, and prenatal yoga are great during pregnancy. Always consult your doctor first.');
    }
    
    if (message.includes('emergency') || message.includes('help') || message.includes('urgent')) {
      return t('assistant.responses.emergency', '🚨 For medical emergencies, call your doctor or emergency services immediately. This chat is for guidance only.');
    }
    
    if (message.includes('appointment') || message.includes('checkup') || message.includes('visit')) {
      return t('assistant.responses.appointment', 'Regular prenatal checkups are important. Make sure to attend all scheduled appointments with your healthcare provider.');
    }
    
    if (message.includes('baby') || message.includes('kick') || message.includes('movement')) {
      return t('assistant.responses.baby', 'Baby movements usually start around 18-20 weeks. If you notice decreased movement, contact your doctor.');
    }
    
    if (message.includes('sleep') || message.includes('tired') || message.includes('rest')) {
      return t('assistant.responses.sleep', 'Pregnancy can cause fatigue. Try to get 7-9 hours of sleep and rest when you can. Sleep on your side with pillows for support.');
    }
    
    // Default response
    return t('assistant.responses.default', 'I am here to help with your pregnancy questions. Please feel free to ask about symptoms, diet, exercise, or general pregnancy care.');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const currentInput = inputMessage.trim();
    setInputMessage('');

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(currentInput);
      
      // Add assistant response
      const assistantResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorResponse = {
        id: Date.now() + 1,
        text: 'I apologize, but I encountered an error. Please try again later.',
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { text: t('assistant.quickActions.medication', 'What medications can I take?'), icon: '💊' },
    { text: t('assistant.quickActions.diet', 'What should I eat during pregnancy?'), icon: '🥗' },
    { text: t('assistant.quickActions.emergency', 'When should I call the doctor?'), icon: '🚨' },
    { text: t('assistant.quickActions.exercise', 'What exercises are safe?'), icon: '🧘‍♀️' }
  ];

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{t('assistant.title', 'AI Pregnancy Assistant')}</h3>
                <div className="flex items-center space-x-2">
                  <p className="text-xs opacity-90">{t('assistant.subtitle', 'Always here to help')}</p>
                  <span className={`w-2 h-2 rounded-full ${
                    aiServiceStatus === 'available' ? 'bg-green-300' : 
                    aiServiceStatus === 'fallback' ? 'bg-yellow-300' : 
                    aiServiceStatus === 'error' ? 'bg-red-300' : 'bg-gray-300'
                  }`} title={
                    aiServiceStatus === 'available' ? 'AI Active' :
                    aiServiceStatus === 'fallback' ? 'Basic Mode' :
                    aiServiceStatus === 'error' ? 'Error' : 'Connecting...'
                  }></span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-pink-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-pink-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">{t('assistant.quickQuestionsLabel', 'Quick questions to get started:')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputMessage(action.text);
                        inputRef.current?.focus();
                      }}
                      className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg text-xs border border-pink-200 transition-colors flex items-center space-x-1"
                    >
                      <span>{action.icon}</span>
                      <span className="truncate">{action.text}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">
                  Or type your own question below 👇
                </p>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('assistant.inputPlaceholder', 'Ask about pregnancy, symptoms, diet...')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isTyping ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Avatar Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <>
              {/* Human-like avatar */}
              <div className="relative">
                <UserCircleIcon className="w-8 h-8" />
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </>
          )}
        </button>
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {t('assistant.tooltipText', 'Chat with AI Assistant')}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Styles for animations */}
      <style>{`
        @keyframes slide-in-from-bottom-2 {
          from {
            transform: translateY(8px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-bottom-2 {
          animation-name: slide-in-from-bottom-2;
        }
      `}</style>
    </>
  );
};

export default AssistantHover;
