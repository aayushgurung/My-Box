import { BriefcaseBusiness, Clock3, Home, MapPin, Truck, UsersRound } from 'lucide-react';
export const networkContent = {
  driver: {
    eyebrow: 'DRIVE WITH MYBOX', heading: 'A local route.', highlight: 'A new opportunity.',
    description: 'Know your neighbourhood? Put that knowledge to work. Explore delivery opportunities and take the first step towards joining the MyBox driver network.',
    cta: 'Register your interest', artLabel: 'Local routes. Real connections.',
    benefitEyebrow: 'A little about the opportunity', benefitHeading: 'Make your next move', benefitHighlight: 'closer to home.',
    benefitDescription: 'Every application begins with a few details about you. The team can then discuss availability, requirements and opportunities in your area.',
    benefits: [
      { icon: Clock3, title: 'Share your availability', text: 'Tell us whether you are looking for full-time, part-time or weekend opportunities.' },
      { icon: MapPin, title: 'Bring your local knowledge', text: 'Let us know where you are based and the communities you know best.' },
      { icon: Truck, title: 'Find your next route', text: 'Share your vehicle details so we can discuss suitable opportunities.' },
    ],
    formHeading: 'Your next route', formDescription: 'Complete the application and help us understand how you could fit into the network.', firstStep: 'Your contact details, vehicle and availability.',
    disclaimer: 'Submitting an application does not guarantee a driving position.',
    faqs: [
      { q: 'Do I need my own vehicle?', a: 'Share your vehicle type or indicate that you need support. The team will discuss vehicle requirements for available opportunities.' },
      { q: 'Can I apply for weekend work?', a: 'Yes. Choose Weekends in the availability field so the team can consider your preference when discussing opportunities.' },
      { q: 'What happens after I apply?', a: 'Your enquiry is sent to MyBox. The team can then contact you to discuss local availability, eligibility and next steps.' },
    ],
  },
  franchise: {
    eyebrow: 'GROW WITH MYBOX', heading: 'Your community.', highlight: 'More possibilities.',
    description: 'Bring a more connected delivery experience to your area. Explore a MyBox franchise and start a conversation about building something local.',
    cta: 'Enquire about a franchise', artLabel: 'A local business. A shared network.',
    benefitEyebrow: 'A business with local roots', benefitHeading: 'Think local.', benefitHighlight: 'Build together.',
    benefitDescription: 'Tell us about your location, experience and plans. The team can explain the model, investment requirements and next steps.',
    benefits: [
      { icon: Home, title: 'Rooted in your community', text: 'Explore how a MyBox location could fit into the area you know and care about.' },
      { icon: UsersRound, title: 'Part of a wider network', text: 'Start a conversation about the MyBox model and what partnership could look like.' },
      { icon: BriefcaseBusiness, title: 'Build on your experience', text: 'Bring your business background and ideas to a discussion about your next step.' },
    ],
    formHeading: 'Your next chapter', formDescription: 'Share a little about yourself and the community you would like to serve.', firstStep: 'Your area, experience and investment range.',
    disclaimer: 'Submitting an enquiry does not commit you to a franchise agreement.',
    faqs: [
      { q: 'Can I enquire about my own area?', a: 'Yes. Include your city or postcode and describe your preferred location in the form. The team can discuss the area and network opportunities.' },
      { q: 'How much investment is required?', a: 'Indicate your budget in the form. Exact costs, terms and requirements need to be discussed with the MyBox team before making a decision.' },
      { q: 'Do I need franchise experience?', a: 'Share your relevant experience. The team can discuss your background and the requirements of the franchise model.' },
    ],
  },
};
