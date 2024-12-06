import React from "react";
import { Carousel, Button } from "react-bootstrap";
import Theme from "../../theme/Theme";
import "./slider.css";
interface Slide {
  id: number;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    image: Theme.icons.slider_icon1,
  },
  {
    id: 2,
    image: Theme.icons.slider_icon2,
  },
  {
    id: 3,
    image: Theme.icons.slider_icon3,
  },
];

const Slider: React.FC = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">
        Top Rated, Top Flavors, Top Destination
      </h2>
      <Carousel>
        {slides.map((slide) => (
          <Carousel.Item key={slide.id}>
            <img className="d-block w-100" src={slide.image} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
