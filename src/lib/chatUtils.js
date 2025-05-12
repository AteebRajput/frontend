import { db } from "../firebaseConfig.js";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

export const createChat = async (buyerId, sellerId, productId, productName, productImage) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", buyerId), where("productId", "==", productId));

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].id;
  }

  const chatRef = await addDoc(chatsRef, {
    participants: [buyerId, sellerId],
    productId,
    productName,
    productImage,
    createdAt: serverTimestamp(),
    lastMessage: null,
    unreadCount: 0,
  });

  return chatRef.id;
};

export const sendMessage = async (chatId, senderId, text) => {
    // console.log("Senderid",senderId);
    
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const chatRef = doc(db, "chats", chatId);

  const chatDoc = await getDoc(chatRef);
  if (!chatDoc.exists()) return;

  const chatData = chatDoc.data();
  const recipientId = chatData.participants.find(id => id !== senderId);

  await addDoc(messagesRef, {
    senderId,
    text,
    timestamp: serverTimestamp(),
    read: false,
  });

  await updateDoc(chatRef, {
    lastMessage: { text, timestamp: serverTimestamp(), senderId },
    [`unreadBy.${recipientId}`]: (chatData.unreadBy?.[recipientId] || 0) + 1,
  });
};

export const markChatAsRead = async (chatId, userId) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, { [`unreadBy.${userId}`]: 0 });

  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const messagesSnapshot = await getDocs(messagesRef);
  const batch = writeBatch(db);

  messagesSnapshot.forEach(messageDoc => {
    const messageData = messageDoc.data();
    if (!messageData.read && messageData.senderId !== userId) {
      batch.update(doc(messagesRef, messageDoc.id), { read: true });
    }
  });

  await batch.commit();
};

export const listenToChats = (userId, callback) => {
    // console.log("userid",userId);
    
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", userId)
    );

  return onSnapshot(q, snapshot => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      unreadCount: doc.data().unreadBy?.[userId] || 0,
    })).sort((a, b) => {
      if (!a.lastMessage?.timestamp) return 1;
      if (!b.lastMessage?.timestamp) return -1;
      return b.lastMessage.timestamp.seconds - a.lastMessage.timestamp.seconds;
    });
    // console.log("chats are:",chats);
    
    callback(chats);
  });
};

export const listenToMessages = (chatId, callback) => {
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, snapshot => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

export const getTotalUnreadCount = async (userId) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.reduce((total, doc) => total + (doc.data().unreadBy?.[userId] || 0), 0);
};
