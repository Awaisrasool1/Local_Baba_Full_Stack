import React from "react";
import { Carousel } from "react-bootstrap";
import "./styles.css";
import Theme from "../../theme/Theme";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  testimonial: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Hannah Schmitt",
    role: "Lead Designer",
    testimonial:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus nibh mauris, nec turpis orci lectus malesuada. Suspendisse sed magna eget nibh in turpis.",
    image: Theme.icons.user_icon1,
  },
  {
    id: 2,
    name: "John Doe",
    role: "Product Manager",
    testimonial:
      "Curabitur vel urna quis neque feugiat vehicula eget quis est. Fusce a metus eget lorem pharetra cursus at vitae sapien.",
    image: Theme.icons.user_icon2,
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Software Engineer",
    testimonial:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut id velit sed urna auctor facilisis.",
    image: Theme.icons.user_icon3,
  },
];

const TestimonialCarousel: React.FC = () => {
  return (
    <div className="container my-5 text-center mt-5">
      <h5 className="text-uppercase mb-3" style={{color:'#5667AB'}}>What They Say</h5>
      <h2 className="mb-5">What Our Customers Say About Us</h2>
      <Carousel indicators={false}>
        {testimonials.map((testimonial) => (
          <Carousel.Item key={testimonial.id}>
            <div className="d-flex flex-column align-items-center">
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "15px",
                }}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="img-fluid"
                />
              </div>
              <h5 className="fw-bold">{testimonial.name}</h5>
              <p className="text-muted">{testimonial.role}</p>
              <p className="text-center px-4" style={{ maxWidth: "600px" }}>
                {testimonial.testimonial}
              </p>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default TestimonialCarousel;
