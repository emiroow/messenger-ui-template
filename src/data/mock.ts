export type Conversation = {
  id: string; // conversation id
  userId: string; // peer user id
  handle?: string; // @username like handle
  name: string;
  avatar?: string | null;
  lastMessage: string;
  unread?: number;
  online?: boolean;
};

export type Message = {
  id: string;
  userId: string; // sender user id
  content: string;
  timestamp: string; // ISO string
  avatar?: string | null;
};

export const currentUserId = "u_me";
export const currentUserHandle = "me";

export const conversations: Conversation[] = [
  {
    id: "1",
    userId: "u_sara",
    handle: "sara",
    name: "Sara",
    avatar: null,
    lastMessage: "باشه ممنون 🌟",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    userId: "u_ali",
    handle: "ali.reza",
    name: "Ali Reza",
    avatar: null,
    lastMessage: "فایل رو ارسال کردم",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    userId: "u_team",
    handle: "product-team",
    name: "Product Team",
    avatar: null,
    lastMessage: "Meeting at 3pm",
  },
];

export const messagesByConversation: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      userId: "u_sara",
      content: "سلام! پروژه به کجا رسید؟",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "m2",
      userId: "u_me",
      content: "سلام، تسک‌ها ۹۰٪ انجام شده. الان روی UI کار می‌کنم.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "m3",
      userId: "u_sara",
      content: "عالیه! هر وقت آماده شد خبر بده.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
  ],
  "2": [
    {
      id: "m1",
      userId: "u_ali",
      content: "سلام، اینم فایل گزارش.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ],
  "3": [
    {
      id: "m1",
      userId: "u_team",
      content: "Don’t forget the roadmap update.",
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
  ],
};
