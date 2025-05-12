import React from "react";
import { Avatar } from "../ui/product-ui/Avatar";
import { Button } from "../ui/product-ui/Button";
import { Badge } from "../ui/Badge";
import { formatDistanceToNow } from "date-fns";


const ChatListItem = ({ chat, currentUserId, otherUserName, onClick, isActive }) => {
  const isLastMessageFromMe = chat.lastMessage?.senderId === currentUserId;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`w-full justify-start px-3 py-2 h-auto relative ${
        chat.unreadCount > 0 && !isLastMessageFromMe ? "bg-muted/50" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center w-full gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <img  
              src={chat.productImage || "/placeholder.svg?height=40&width=40"}
              alt={chat.productName}
              width={40}
              height={40}
              className="object-cover"
            />
          </Avatar>
          {chat.unreadCount > 0 && !isLastMessageFromMe && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {chat.unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex flex-col items-start text-left flex-1 overflow-hidden">
          <div className="flex justify-between w-full">
            <span className="font-medium truncate">{otherUserName}</span>
            {chat.lastMessage?.timestamp && (
              <span className="text-xs text-muted-foreground ml-2 shrink-0">
                {formatDistanceToNow(new Date(chat.lastMessage.timestamp.toDate()), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground truncate w-full">
            {chat.productName}
          </span>
          {chat.lastMessage && (
            <p className="text-sm truncate w-full mt-1">
              {isLastMessageFromMe && "You: "}
              {chat.lastMessage.text}
            </p>
          )}
        </div>
      </div>
    </Button>
  );
};

export default ChatListItem;
