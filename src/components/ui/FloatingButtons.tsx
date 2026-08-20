import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
      <a 
        href="#" 
        className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-transform hover:scale-10"
        title="WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
      <a 
        href="#" 
        className="w-14 h-14 bg-[#ff0000] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#e60000] transition-transform hover:scale-10"
        title="Messenger"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
}
