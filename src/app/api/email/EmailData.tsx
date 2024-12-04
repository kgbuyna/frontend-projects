import mock from "../mock";
import type { EmailType } from "@/app/(DashboardLayout)/types/apps/email";
import { sub } from "date-fns";

const EmailData: EmailType[] = [
  {
    id: 1,
    from: "James Smith",
    thumbnail: "/images/profile/user-10.jpg",
    subject: "Kindly check this latest updated",
    time: sub(new Date(), { days: 0, hours: 1, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt:
      "Contrary to popular belief, Lorem Ipsum is not simply random text. ",
    emailContent: `<p>Hello Andrew, </p>
       <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum hendrerit lobortis. Nullam ut lacus eros. Sed at luctus urna, eu fermentum diam. In et tristique mauris.</p>
       <p>Ut id ornare metus, sed auctor enim. Pellentesque nisi magna, laoreet a augue eget, 
       tempor volutpat diam.</p>
       <p>Regards,<br/> <b>James Smith</b></p>
       `,
    unread: true,
    attachment: false,
    starred: true,
    important: false,
    inbox: true,
    sent: false,
    draft: false,
    spam: false,
    trash: false,
    label: "Promotional",
    attchments: [
      {
        id: "#1Attach",
        image: "/images/chat/icon-adobe.svg",
        title: "adobe.pdf",
        fileSize: "2MB"
      },
      {
        id: "#2Attach",
        image: "/images/chat/icon-chrome.svg",
        title: "abouts.html",
        fileSize: "2MB"
      },
      {
        id: "#3Attach",
        image: "/images/chat/icon-zip-folder.svg",
        title: "cheese.zip",
        fileSize: "2MB"
      }
    ]
  },
  {
    id: 2,
    from: "Michael Smith",
    thumbnail: "/images/profile/user-2.jpg",
    subject: "Fact that a reader will be distracted.",
    time: sub(new Date(), { days: 0, hours: 3, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt:
      "It has roots in a piece of classical Latin literature from 45 BC",
    emailContent: `<p>Hello Andrew, </p>
       <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum hendrerit lobortis. Nullam ut lacus eros. Sed at luctus urna, eu fermentum diam. In et tristique mauris.</p>
       <p>Ut id ornare metus, sed auctor enim. Pellentesque nisi magna, laoreet a augue eget, 
       tempor volutpat diam.</p>
       <p>Regards,<br/> <b>Michael Smith</b></p>
       `,
    unread: true,
    attachment: false,
    starred: true,
    important: false,
    inbox: false,
    sent: false,
    draft: true,
    spam: false,
    trash: false,
    label: "Social",
    attchments: []
  },
  {
    id: 3,
    from: "Robert Smith",
    thumbnail: "/images/profile/user-3.jpg",
    subject:
      "The point of using Lorem Ipsum is that it has a more-or-less normal",
    time: sub(new Date(), { days: 0, hours: 11, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "Richard McClintock, a Latin professor at Hampden-Sydney",
    emailContent:
      "<p>Dummy text is also used to demonstrate the appearance of different typefaces and layouts, and in general the content of dummy text is nonsensical. ",
    unread: false,
    attachment: false,
    starred: false,
    important: true,
    inbox: false,
    sent: true,
    draft: false,
    spam: false,
    trash: false,
    label: "Promotional",
    attchments: [
      {
        id: "#4Attach",
        image: "/images/chat/icon-figma.svg",
        title: "service.fig",
        fileSize: "2MB"
      },
      {
        id: "#5Attach",
        image: "/images/chat/icon-javascript.svg",
        title: "abouts.js",
        fileSize: "2MB"
      }
    ]
  },
  {
    id: 4,
    from: "Maria Garcia",
    thumbnail: "/images/profile/user-4.jpg",
    subject: "Contrary to popular belief, Lorem Ipsum is.",
    time: sub(new Date(), { days: 1, hours: 2, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "Lorem Ipsum passage, and going through",
    emailContent:
      "<p>Furthermore, it is advantageous when the dummy text is relatively realistic so that the layout impression of the final publication is not compromised.</p>",
    unread: false,
    attachment: true,
    starred: true,
    important: false,
    inbox: false,
    sent: false,
    draft: true,
    spam: false,
    trash: false,
    label: "Social",
    attchments: []
  },
  {
    id: 5,
    from: "David Smith",
    thumbnail: "/images/profile/user-5.jpg",
    subject: "Literature from 45 BC, making",
    time: sub(new Date(), { days: 1, hours: 8, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "The standard chunk of Lorem Ipsum used since the 1500s",
    emailContent:
      "<p>One disadvantage of Lorum Ipsum is that in Latin certain letters appear more frequently than others which creates a distinct visual impression.</p>",
    unread: false,
    attachment: false,
    starred: false,
    important: true,
    inbox: true,
    sent: false,
    draft: false,
    spam: false,
    trash: false,
    label: "Social",
    attchments: []
  },
  {
    id: 6,
    from: "Maria Rodriguez",
    thumbnail: "/images/profile/user-6.jpg",
    subject: "Latin professor at Hampden-Sydney College.",
    time: sub(new Date(), { days: 1, hours: 10, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "Cicero are also reproduced in their exact original form",
    emailContent:
      "<p>Thus, Lorem Ipsum has only limited suitability as a visual filler for German texts. If the fill text is intended to illustrate the characteristics of different typefaces.</p>",
    unread: false,
    attachment: true,
    starred: false,
    important: true,
    inbox: true,
    sent: false,
    draft: false,
    spam: false,
    trash: false,
    label: "Health",
    attchments: []
  },
  {
    id: 7,
    from: "Mary Smith",
    thumbnail: "/images/profile/user-7.jpg",
    subject: "the cites of the word in classical.",
    time: sub(new Date(), { days: 1, hours: 11, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt:
      "There are many variations of passages of Lorem Ipsum available",
    emailContent:
      "<p>There is now an abundance of readable dummy texts. These are usually used when a text is required purely to fill a space.These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or nonsensical stories.</p>",
    unread: true,
    attachment: true,
    starred: false,
    important: false,
    inbox: true,
    sent: false,
    draft: false,
    spam: false,
    trash: false,
    label: "Social",
    attchments: []
  },
  {
    id: 8,
    from: "Maria Hernandez",
    thumbnail: "/images/profile/user-8.jpg",
    subject: " This book is a treatise on the theory of ethics.",
    time: sub(new Date(), { days: 2, hours: 1, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt:
      "the majority have suffered alteration in some form, by injected ",
    emailContent:
      "<p>According to most sources, Lorum Ipsum can be traced back to a text composed by Cicero in 45 BC. Allegedly, a Latin scholar established the origin of the text.</p>",
    unread: false,
    attachment: true,
    starred: false,
    important: true,
    inbox: false,
    sent: false,
    draft: false,
    spam: true,
    trash: false,
    label: "Social",
    attchments: []
  },
  {
    id: 9,
    from: "Maria Martinez",
    thumbnail: "/images/profile/user-9.jpg",
    subject: "Lorem Ipsum used since the 1500s is reproduced.",
    time: sub(new Date(), { days: 2, hours: 3, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "If you are going to use a passage of Lorem Ipsum",
    emailContent:
      "<p>It seems that only fragments of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters.</p>",
    unread: false,
    attachment: true,
    starred: false,
    important: false,
    inbox: false,
    sent: false,
    draft: false,
    spam: false,
    trash: true,
    label: "Promotional",
    attchments: []
  },
  {
    id: 10,
    from: "James Johnson",
    thumbnail: "/images/profile/user-2.jpg",
    subject: "accompanied by English versions from the 1914 translation.",
    time: sub(new Date(), { days: 2, hours: 8, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "you need to be sure there isn't anything",
    emailContent:
      "<p>This might also explain why one can now find slightly different versions. Due to the age of the Lorem Ipsum text there are no copyright issues to contend with.</p>",
    unread: false,
    attachment: true,
    starred: true,
    important: false,
    inbox: false,
    sent: true,
    draft: false,
    spam: false,
    trash: false,
    label: "Health",
    attchments: []
  },
  {
    id: 11,
    from: "James Smith",
    thumbnail: "/images/profile/user-3.jpg",
    subject: "All the Lorem Ipsum generators on the Internet.",
    time: sub(new Date(), { days: 2, hours: 9, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt:
      "All the Lorem Ipsum generators on the Internet tend to repeat predefined",
    emailContent:
      "<p>The spread of computers and layout programmes thus made dummy text better known. While in earlier times several lines of the Lorem Ipsum text were repeated in the creation of dummy texts.</p>",
    unread: false,
    attachment: false,
    starred: true,
    important: false,
    inbox: true,
    sent: false,
    draft: false,
    spam: false,
    trash: false,
    label: "Promotional",
    attchments: []
  },
  {
    id: 12,
    from: "Michael Smith",
    thumbnail: "/images/profile/user-7.jpg",
    subject: "Latin words, combined with a handful.",
    time: sub(new Date(), { days: 2, hours: 11, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "combined with a handful of model sentence structures",
    emailContent:
      "<p>basis for many dummy text or Lorem Ipsum generators. Based on 'De finibus', these generators automatically create longer sections of the Lorem Ipsum text or various other filler texts.</p>",
    unread: false,
    attachment: false,
    starred: false,
    important: false,
    inbox: true,
    sent: false,
    draft: true,
    spam: false,
    trash: true,
    label: "Social",
    attchments: []
  },
  {
    id: 13,
    from: "Robert Smith",
    thumbnail: "/images/profile/user-2.jpg",
    subject: "If you are going to use a passage.",
    time: sub(new Date(), { days: 3, hours: 2, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt:
      "Lorem Ipsum is therefore always free from repetition, injected humour",
    emailContent:
      "<p>The phrasal sequence of the Lorem Ipsum text is now so widespread and commonplace that many DTP programmes can generate dummy text using the starting sequence.</p>",
    unread: false,
    attachment: true,
    starred: true,
    important: true,
    inbox: false,
    sent: true,
    draft: false,
    spam: false,
    trash: false,
    label: "Health",
    attchments: []
  },
  {
    id: 14,
    from: "Maria Garcia",
    thumbnail: "/images/profile/user-3.jpg",
    subject: "piece of classical Latin literature.",
    time: sub(new Date(), { days: 3, hours: 11, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "Lorem Ipsum passage, and going through the cites",
    emailContent:
      "<p>now recognized by electronic pre-press systems and, when found, an alarm can be raised. This avoids a publication going to print with overlooked dummy text.</p>",
    unread: false,
    attachment: false,
    starred: true,
    important: false,
    inbox: false,
    sent: false,
    draft: false,
    spam: false,
    trash: true,
    label: "Social",
    attchments: []
  },
  {
    id: 15,
    from: "David Smith",
    thumbnail: "/images/profile/user-4.jpg",
    subject: "first true generator on the Internet.",
    time: sub(new Date(), { days: 3, hours: 4, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    emailContent:
      "<p>Certain internet providers exploit the fact that fill text cannot be recognized by automatic search engines - meaningful information cannot be distinguished from meaningless.</p>",
    unread: false,
    attachment: true,
    starred: false,
    important: false,
    inbox: false,
    sent: false,
    draft: false,
    spam: false,
    trash: true,
    label: "Promotional",
    attchments: []
  },
  {
    id: 16,
    from: "Maria Rodriguez",
    thumbnail: "/images/profile/user-5.jpg",
    subject: "combined with a handful of model sentence structure.",
    time: sub(new Date(), { days: 4, hours: 1, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt:
      "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
    emailContent:
      "<p>Target-generated dummy text mixed with a certain combination of search terms can lead to an increased frequency of visits by search machine users. As a consequence, advertising revenues, which rely on website 'hits', are increased.</p>",
    unread: true,
    attachment: false,
    starred: false,
    important: true,
    inbox: true,
    sent: false,
    draft: false,
    spam: false,
    trash: true,
    label: "Social",
    attchments: []
  },
  {
    id: 17,
    from: "Mary Smith",
    thumbnail: "/images/profile/user-6.jpg",
    subject: "randomised words which don't look even.",
    time: sub(new Date(), { days: 4, hours: 1, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "when an unknown printer took a galley of type",
    emailContent:
      "<p>Vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra. Amet nisl suscipit adipiscing bibendum est ultricies integer.</p>",
    unread: true,
    attachment: false,
    starred: false,
    important: false,
    inbox: false,
    sent: false,
    draft: false,
    spam: true,
    trash: false,
    label: "Health",
    attchments: []
  },
  {
    id: 18,
    from: "Maria Hernandez",
    thumbnail: "/images/profile/user-7.jpg",
    subject: "Lorem Ipsum generators on the Internet tend.",
    time: sub(new Date(), { days: 4, hours: 1, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "scrambled it to make a type specimen book",
    emailContent:
      "<p>Volutpat diam ut venenatis tellus in metus vulputate eu. Id aliquet lectus proin nibh nisl condimentum id venenatis. Risus quis varius quam quisque id diam vel. Pulvinar pellentesque habitant morbi tristique senectus et netus et.</p>",
    unread: false,
    attachment: false,
    starred: false,
    important: true,
    inbox: false,
    sent: true,
    draft: false,
    spam: false,
    trash: false,
    label: "Promotional",
    attchments: []
  },
  {
    id: 19,
    from: "Maria Martinez",
    thumbnail: "/images/profile/user-8.jpg",
    subject: "combined with a handful of model.",
    time: sub(new Date(), { days: 4, hours: 1, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "It has survived not only five centuries",
    emailContent:
      "<p>Scelerisque purus semper eget duis at. Tempus imperdiet nulla malesuada pellentesque elit. Vitae semper quis lectus nulla at volutpat. Ac tortor vitae purus faucibus ornare suspendisse.</p>",
    unread: true,
    attachment: false,
    starred: false,
    important: false,
    inbox: false,
    sent: false,
    draft: true,
    spam: false,
    trash: false,
    label: "Health",
    attchments: []
  },
  {
    id: 20,
    from: "James Johnson",
    thumbnail: "/images/profile/user-10.jpg",
    subject: "The Extremes of Good and Evil.",
    time: sub(new Date(), { days: 4, hours: 1, minutes: 45 }),
    To: "abc@company.com",
    emailExcerpt: "the 1960s with the release of Letraset sheets containings",
    emailContent:
      "<p>Ultrices in iaculis nunc sed augue lacus viverra. Tellus cras adipiscing enim eu turpis egestas. Libero enim sed faucibus turpis in eu mi bibendum neque. Consectetur adipiscing elit ut aliquam. Mattis nunc sed blandit libero volutpat sed cras. </p>",
    unread: false,
    attachment: true,
    starred: true,
    important: true,
    inbox: true,
    sent: false,
    draft: false,
    spam: false,
    trash: false,
    label: "Social",
    attchments: []
  }
];

mock.onGet("/api/data/email/EmailData").reply(() => {
  const emails = EmailData;

  return [200, JSON.parse(JSON.stringify(emails))];
});

export default EmailData;
