'use client';

import React, { useState } from 'react';
import { Button } from '../ui/product-ui/Button';
import { MessageCircle } from 'lucide-react';
import ChatDialog from './ChatDialog';
import { createChat } from '../../lib/chatUtils';

function ChatButton({ currentUserId, sellerId, sellerName, productId, productName, productImage }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
console.log("cuurent user",currentUserId);

  const handleStartChat = async () => {
    if (currentUserId === sellerId) {
      return;
    }

    const newChatId = await createChat(currentUserId, sellerId, productId, productName, productImage);
    setChatId(newChatId);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button onClick={handleStartChat} variant="outline" className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4" />
        <span>Contact Seller</span>
      </Button>

      {chatId && (
        <ChatDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          chatId={chatId}
          currentUserId={currentUserId}
          recipientName={sellerName}
          productName={productName}
        />
      )}
    </>
  );
}

export default ChatButton;
