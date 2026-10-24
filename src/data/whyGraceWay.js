// Facts come from client-provided content only. Do not add awards, client counts, certifications or security claims.
// PLACEHOLDER: replace images with real photos before launch.
import uaeSkylineImg from '../assets/why/uae-skyline.webp';
import teamMeetingImg from '../assets/why/team-meeting.webp';
import { siteConfig } from './siteConfig';
import { aboutData } from './about';

const expStat = aboutData.floatingStats.find((s) => s.value === 25) || {
  value: 25,
  suffix: '+',
  label: 'Years of UAE experience',
};

export const whyGraceWayData = {
  header: {
    badge: "WHY GRACE WAY",
    title: "A trusted UAE partner for accounting, tax and advisory",
    subtitle: "Experienced professionals and practical solutions, focused on keeping your business compliant and growing.",
    cta: {
      text: "Get a Free Enquiry",
      href: "#contact",
    },
  },
  tiles: [
    {
      id: "professionals",
      variant: "soft",
      tone: "gold", // warm gold-tint gradient
      title: "Experienced professionals",
      text: "Industry expertise applied to your accounts, tax and advisory needs.",
      icon: "UserCheck",
    },
    {
      id: "solutions",
      variant: "soft",
      tone: "blue", // cool light-blue/grey gradient
      title: "Innovative solutions",
      text: "Accounting software and e-invoicing to keep your finances efficient.",
      icon: "Lightbulb",
    },
    {
      id: "experience",
      variant: "image",
      isWide: true, // spans 2 columns on lg
      title: "25+ years of UAE experience",
      statValue: expStat.value,
      statSuffix: expStat.suffix,
      statAriaLabel: `${expStat.value}${expStat.suffix} Years of UAE market experience`,
      text: "Deep knowledge of the UAE market and its regulations.",
      image: uaeSkylineImg,
      imageAlt: "Panoramic view of modern Dubai UAE skyline and financial towers",
      imageWidth: 1050,
      imageHeight: 586,
    },
    {
      id: "compliance",
      variant: "image",
      isWide: false,
      title: "Compliance first",
      text: "Support with Corporate Tax, VAT and AML requirements.",
      image: teamMeetingImg,
      imageAlt: "Grace Way Accounting professionals collaborating in an executive boardroom",
      imageWidth: 900,
      imageHeight: 675,
    },
  ],
};
