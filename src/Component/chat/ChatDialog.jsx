'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/product-ui/Dialog';
import { Button } from '../ui/product-ui/Button';
import { Input } from '../ui/product-ui/Input';
import { Send } from 'lucide-react';
import { listenToMessages, sendMessage, markChatAsRead } from '../../lib/chatUtils';
import { formatDistanceToNow } from 'date-fns';

function ChatDialog({ isOpen, onClose, chatId, currentUserId, recipientName, productName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Chat with {recipientName}</span>
            <span className="text-sm text-muted-foreground">about {productName}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[60vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.senderId === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp
                      ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true })
                      : 'Sending...'}
                    {message.senderId === currentUserId && <span className="ml-2">{message.read ? '✓✓' : '✓'}</span>}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
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
