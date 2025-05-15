import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Container from "../global/container";

const FAQS = [
  {
    question: "What is this platform?",
    answer: "Our platform is an AI-powered survey solution that lets you create, publish, and analyze surveys with advanced analytics and actionable insights."
  },
  {
    question: "How does AI-powered analysis work?",
    answer: "Our AI analyzes survey responses in real time, providing you with summaries, trends, and actionable recommendations—no manual work required."
  },
  {
    question: "Can I share my surveys with anyone?",
    answer: "Yes! You can share surveys via link or QR code. Anyone can participate, and you can track responses instantly."
  },
  {
    question: "What integrations are available?",
    answer: "We support integrations with Slack, Zapier, Google Sheets, and more, so you can automate workflows and sync your survey data."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade security and encryption to keep your data safe and private."
  },
  {
    question: "What are the pricing options?",
    answer: "We offer Free, Pro, and Enterprise plans to fit every need. See our Pricing section for details."
  },
  {
    question: "Do you offer customer support?",
    answer: "Yes, we offer email support for all users and priority support for Pro and Enterprise customers."
  }
];

const FAQ = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full">
      <Container>
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug mt-6">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-center text-accent-foreground/80 mt-6">
            Everything you need to know about our AI-powered survey platform.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          {FAQS.map((faq, idx) => (
            <AccordionItem value={"faq-" + idx} key={idx}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </div>
  );
};

export default FAQ; 