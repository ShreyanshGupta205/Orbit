import { ChevronDown } from "lucide-react";
import "./FAQ.css";

const leftQuestions = [
  "What is NERA?",
  "How does NERA get its data?",
  "Is NERA available for all districts?",
];

const rightQuestions = [
  "Is there a mobile app?",
  "How do I report an incident?",
  "Who can use NERA?",
];

function FAQItem({ question }: { question: string }) {
  return (
    <button className="faq-item">
      <span>{question}</span>

      <ChevronDown className="faq-chevron" />
    </button>
  );
}

export default function FAQ() {
  return (
    <section className="faq-section">
      <div className="faq-container">

        <div className="faq-heading">
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-grid">

          <div className="faq-column">
            {leftQuestions.map((question) => (
              <FAQItem
                key={question}
                question={question}
              />
            ))}
          </div>

          <div className="faq-column">
            {rightQuestions.map((question) => (
              <FAQItem
                key={question}
                question={question}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}