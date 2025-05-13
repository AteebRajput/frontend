import { useState, useEffect } from 'react';
import axios from 'axios';
import { listenToChats, markChatAsRead } from '../../lib/chatUtils';
import ChatListItem from '../chat/chat-list-item';
import ChatDialog from '../chat/ChatDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/product-ui/Tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/product-ui/Card';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Get current user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
let currentUser = {};
if (user) {
  currentUser = {
    id: user.user._id,
    name: user.user.name,
    role: user.user.role,
  };
}

export default function MessagesSeller() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [usernames, setUsernames] = useState({}); 

  const {t} = useTranslation();

  // Function to fetch and store username for a userId
  const fetchAndStoreUsername = async (userId) => {
    if (usernames[userId]) return; // already fetched

    try {
      const response = await axios.get(`http://localhost:5000/api/auth/getUsername?userId=${userId}`);
      const username = response.data.username;
      setUsernames((prev) => ({ ...prev, [userId]: username }));
    } catch (error) {
      console.error(`Error fetching username for ${userId}:`, error.message);
      setUsernames((prev) => ({ ...prev, [userId]: "Unknown User" }));
    }
  };

  // Fetch chats and usernames when component mounts
  useEffect(() => {
    const unsubscribe = listenToChats(currentUser.id, async (updatedChats) => {
      // Filter chats to include only those that have the current user as a participant
      const filteredChats = updatedChats.filter((chat) => 
        chat.participants.includes(currentUser.id)
      );

      setChats(filteredChats);

      // For each chat, fetch the other participant's username
      filteredChats.forEach((chat) => {
        const otherUserId = chat.participants.find((id) => id !== currentUser.id);
        if (otherUserId) fetchAndStoreUsername(otherUserId);
      });
    });

    return () => unsubscribe();
  }, []); // The useEffect only runs once when the component mounts

  // Get readable name for other user in chat
  const getOtherUserName = (participants, currentUserId) => {
    const otherUserId = participants.find((id) => id !== currentUserId);
    return usernames[otherUserId] || "Loading...";
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setIsChatDialogOpen(true);
    markChatAsRead(chat.id, currentUser.id);
  };

  const filteredChats = activeTab === 'all' ? chats : chats.filter((chat) => chat.unreadCount > 0);

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t("yourMessages")}
            </CardTitle>
            <CardDescription>
              {t("yourMessagesDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">{t("allMessages")}</TabsTrigger>
                <TabsTrigger value="unread">
                  {t("unread")}
                  {chats.some((chat) => chat.unreadCount > 0) && (
                    <span className="ml-2 bg-destructive text-destructive-foreground rounded-full px-2 py-0.5 text-xs">
                      {chats.reduce((acc, chat) => acc + chat.unreadCount, 0)}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-1">
                  {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                      <ChatListItem
                        key={chat.id}
                        chat={chat}
                        currentUserId={currentUser.id}
                        otherUserName={getOtherUserName(chat.participants, currentUser.id)}
                        onClick={() => handleChatSelect(chat)}
                        isActive={selectedChat?.id === chat.id}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="mx-auto h-12 w-12 mb-3 opacity-20" />
                      <p>{t("noMessages")}</p>
                      <p className="text-sm">
                        {t("noMessagesHint")}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="unread">
                <div className="space-y-1">
                  {filteredChats.length > 0 ? (
                    filteredChats.map((chat) => (
                      <ChatListItem
                        key={chat.id}
                        chat={chat}
                        currentUserId={currentUser.id}
                        otherUserName={getOtherUserName(chat.participants, currentUser.id)}
                        onClick={() => handleChatSelect(chat)}
                        isActive={selectedChat?.id === chat.id}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>{t("noUnreadMessages")}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedChat && (
        <ChatDialog
          isOpen={isChatDialogOpen}
          onClose={() => setIsChatDialogOpen(false)}
          chatId={selectedChat.id}
          currentUserId={currentUser.id}
          recipientName={getOtherUserName(selectedChat.participants, currentUser.id)}
          productName={selectedChat.productName}
        />
      )}
    </div>
  );
}
