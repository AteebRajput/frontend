'use client';

import React, { useState } from 'react';
import { Button } from '../ui/product-ui/Button';
import { MessageCircle } from 'lucide-react';
import ChatDialog from './ChatDialog';
import axios from 'axios';

import { createChat } from '../../lib/chatUtils';
import { use } from 'i18next';



function ChatButton({ currentUserId, sellerId, sellerName, productId, productName, productImage }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [username,setUsername] = useState("")


const fetchAndStoreUsername = async (userId) => {


  try {
    const response = await axios.get(`https://backend-production-c261.up.railway.app/api/auth/getUsername?userId=${userId}`);
    const user = response.data.username;
    setUsername(user);

  } catch (error) {
    console.error(`Error fetching username for ${userId}:`, error.message);
    
  }
};

fetchAndStoreUsername(sellerId)

  const handleStartChat = async () => {
    if (currentUserId === sellerId) {
      return;
    }

    const newChatId = await createChat(currentUserId, sellerId, productId, productName, productImage);
    setChatId(newChatId);
    setIsDialogOpen(true);
  };
  // console.log("seller name",);
  

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
          recipientName={username}
          productName={productName}
        />
      )}
    </>
  );
}

export default ChatButton;
