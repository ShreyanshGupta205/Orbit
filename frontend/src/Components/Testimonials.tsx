import "./Testimonials.css";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "NERA has transformed how we respond to road incidents. Real-time alerts save lives and reduce delays.",
    name: "Priya Sharma",
    role: "District Transport Officer, Assam",
    image: "/images/user-1.jpg",
  },
  {
    quote:
      "The real-time data and AI insights help us plan better and allocate resources effectively.",
    name: "Rajesh Singh",
    role: "Executive Engineer, Meghalaya",
    image: "/images/user-2.jpg",
  },
  {
    quote:
      "A must-have tool for anyone working on infrastructure and disaster management in the Northeast.",
    name: "Anjali Das",
    role: "NOC Coordinator, Manipur",
    image: "/images/user-3.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">

        <div className="testimonials-heading">
          <h2>What Our Users Say</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article
              className="testimonial-card"
              key={testimonial.name}
            >
              <div className="quote-mark">“</div>

              <p className="testimonial-quote">
                {testimonial.quote}
              </p>

              <div className="testimonial-user">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  onError={(e) => {
                    const initials = testimonial.name.split(" ").map(n => n[0]).join("");
                    (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="%2310b981" rx="30"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="20" font-weight="bold">${initials}</text></svg>`;
                  }}
                />

                <div>
                  <strong>{testimonial.name}</strong>

                  <span>{testimonial.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}