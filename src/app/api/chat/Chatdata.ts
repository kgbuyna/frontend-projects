import mock from "../mock";
import { Chance } from "chance";
import type { ChatsType } from "@/app/(DashboardLayout)/types/apps/chat";
import { sub } from "date-fns";
import { uniqueId } from "lodash";

const chance = new Chance();

const ChatData: ChatsType[] = [
  {
    id: 1,
    name: "James Johnson",
    status: "online",
    thumb: "/images/profile/user-10.jpg",
    recent: false,
    excerpt: "Theme Developer",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-adobe.svg",
            file: "service-task.pdf",
            fileSize: "2MB"
          },
          {
            icon: "/images/chat/icon-chrome.svg",
            file: "homepage-design.fig",
            fileSize: "3MB"
          },
          {
            icon: "/images/chat/icon-figma.svg",
            file: "about-us.html",
            fileSize: "1KB"
          },
          {
            icon: "/images/chat/icon-javascript.svg",
            file: "work-project.zip",
            fileSize: "20MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 30 }),
        msg: chance.sentence({ words: 10 }),
        senderId: 1,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: uniqueId(),
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        msg: "/images/blog/blog-img1.jpg",
        senderId: uniqueId(),
        type: "image",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 5 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 2,
    name: "Maria Hernandez",
    status: "away",
    thumb: "/images/profile/user-9.jpg",
    recent: true,
    excerpt: "Doctor",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: uniqueId(),
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-adobe.svg",
            file: "service-task.pdf",
            fileSize: "2MB"
          },
          {
            icon: "/images/chat/icon-chrome.svg",
            file: "homepage-design.fig",
            fileSize: "3MB"
          },
          {
            icon: "/images/chat/icon-javascript.svg",
            file: "work-project.zip",
            fileSize: "20MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 30 }),
        msg: chance.sentence({ words: 10 }),
        senderId: uniqueId(),
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 2,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        msg: "/images/blog/blog-img1.jpg",
        senderId: 2,
        type: "image",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: uniqueId(),
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 3,
    name: "David Smith",
    status: "busy",
    thumb: "/images/profile/user-3.jpg",
    recent: false,
    excerpt: "Hacker",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 10 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-adobe.svg",
            file: "service-task.pdf",
            fileSize: "2MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 30 }),
        msg: chance.sentence({ words: 10 }),
        senderId: 1,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    status: "offline",
    thumb: "/images/profile/user-2.jpg",
    recent: true,
    excerpt: "Please wait outside of the house",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 10 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 4,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-javascript.svg",
            file: "work-project.zip",
            fileSize: "20MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 11 }),
        msg: "/images/blog/blog-img1.jpg",
        senderId: uniqueId(),
        type: "image",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 4,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 1 }),
        msg: chance.sentence({ words: 7 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 5,
    name: "Robert Smith",
    status: "online",
    thumb: "/images/profile/user-5.jpg",
    recent: true,
    excerpt: "Front End Developer",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-adobe.svg",
            file: "service-task.pdf",
            fileSize: "2MB"
          },
          {
            icon: "/images/chat/icon-chrome.svg",
            file: "homepage-design.fig",
            fileSize: "3MB"
          },
          {
            icon: "/images/chat/icon-figma.svg",
            file: "about-us.html",
            fileSize: "1KB"
          },
          {
            icon: "/images/chat/icon-javascript.svg",
            file: "work-project.zip",
            fileSize: "20MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 30 }),
        msg: chance.sentence({ words: 10 }),
        senderId: 1,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: uniqueId(),
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        msg: "/images/blog/blog-img1.jpg",
        senderId: 5,
        type: "image",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 5 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 5,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 6,
    name: "Joseph Sarah",
    status: "busy",
    thumb: "/images/profile/user-10.jpg",
    recent: false,
    excerpt: "Graphics Designer",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 10 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-chrome.svg",
            file: "homepage-design.fig",
            fileSize: "3MB"
          },
          {
            icon: "/images/chat/icon-javascript.svg",
            file: "work-project.zip",
            fileSize: "20MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        msg: "/images/blog/blog-img1.jpg",
        senderId: uniqueId(),
        type: "image",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 5 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 2 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 6,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 7,
    name: "Thomas Smith",
    status: "away",
    thumb: "/images/profile/user-8.jpg",
    recent: true,
    excerpt: "Back End Developer",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 10 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-adobe.svg",
            file: "service-task.pdf",
            fileSize: "2MB"
          },
          {
            icon: "/images/chat/icon-chrome.svg",
            file: "homepage-design.fig",
            fileSize: "3MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 1 }),
        msg: chance.sentence({ words: 10 }),
        senderId: 1,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 15 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 7,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 10 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 7,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 8,
    name: "David Elizabeth",
    status: "offline",
    thumb: "/images/profile/user-3.jpg",
    recent: false,
    excerpt: "Theme Developer",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 10 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-adobe.svg",
            file: "service-task.pdf",
            fileSize: "2MB"
          },
          {
            icon: "/images/chat/icon-javascript.svg",
            file: "work-project.zip",
            fileSize: "20MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 1 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 8,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 9,
    name: "Charles Martha",
    status: "online",
    thumb: "/images/profile/user-4.jpg",
    recent: false,
    excerpt: "Administrator",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 10 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-javascript.svg",
            file: "work-project.zip",
            fileSize: "20MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 8 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 8 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 5 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 9,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 2 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 9,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  },
  {
    id: 10,
    name: "Samuel Eliza",
    status: "online",
    thumb: "/images/profile/user-5.jpg",
    recent: false,
    excerpt: "Doctor",
    messages: [
      {
        createdAt: sub(new Date(), { hours: 10 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 1,
        type: "text",
        attachment: [
          {
            icon: "/images/chat/icon-adobe.svg",
            file: "service-task.pdf",
            fileSize: "2MB"
          },
          {
            icon: "/images/chat/icon-zip-folder.svg",
            file: "custom.js",
            fileSize: "2MB"
          }
        ],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 11 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { hours: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 3,
        type: "text",
        attachment: [],
        id: uniqueId()
      },
      {
        createdAt: sub(new Date(), { minutes: 6 }),
        msg: chance.sentence({ words: 5 }),
        senderId: 10,
        type: "text",
        attachment: [],
        id: uniqueId()
      }
    ]
  }
];

mock.onGet("/api/data/chat/ChatData").reply(() => {
  return [200, ChatData];
});

export default ChatData;
