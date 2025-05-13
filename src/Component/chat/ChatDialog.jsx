'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/product-ui/Dialog';
import { Button } from '../ui/product-ui/Button';
import { Input } from '../ui/product-ui/Input';
import { Send, X } from 'lucide-react';
import { listenToMessages, sendMessage, markChatAsRead } from '../../lib/chatUtils';
import { formatDistanceToNow } from 'date-fns';

function ChatDialog({ isOpen, onClose, chatId, currentUserId, recipientName, productName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  console.log("recipent name",recipientName);
  

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = listenToMessages(chatId, (updatedMessages) => {
      setMessages(updatedMessages);
    });

    if (isOpen) {
      markChatAsRead(chatId, currentUserId);
    }

    return () => unsubscribe();
  }, [chatId, isOpen, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    console.log("chatid",chatId);
    console.log("senderid",currentUserId);
    console.log("message",newMessage);
    await sendMessage(chatId, currentUserId, newMessage);
    setNewMessage('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 overflow-hidden rounded-lg shadow-lg border ">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-lime-600 to-emerald-600" >
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="flex flex-col text-white">
              <span className="text-lg font-semibold">Chat with {recipientName}</span>
              <span className="text-sm text-muted-foreground font-normal">about {productName}</span>
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col h-[60vh]">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <p>Start the conversation with {recipientName}</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => {
                const isSender = message.senderId === currentUserId;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
                        ${isSender 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-white border border-gray-200'
                        }
                      `}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className={`text-xs mt-1 flex items-center justify-end gap-1
                        ${isSender ? 'opacity-70' : 'text-gray-500'}`}>
                        {message.timestamp
                          ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true })
                          : 'Sending...'}
                        {isSender && (
                          <span className="ml-1 flex">
                            {message.read ? (
                              <span className="text-blue-500">✓✓</span>
                            ) : (
                              <span>✓</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
            <div className="flex gap-2 items-center">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-gray-300 focus-visible:ring-primary"
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim()}
                size="icon"
                className="rounded-full h-10 w-10 transition-colors hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatDialog;