import React from "react";
import Theme from "../../theme/Theme";
import "./styles.css";
const FeaturesSection: React.FC = () => {
  const features = [
    {
      id: 1,
      title: "Easy To Order",
      description: "You only need a few steps in ordering food",
      image: Theme.icons.service1, 
    },
    {
      id: 2,
      title: "Fastest Delivery",
      description: "Delivery that is always on time even faster",
      image: Theme.icons.service3, 

    },
    {
      id: 3,
      title: "Best Quality",
      description: "Not only fast, for us quality is also number one",
      image: Theme.icons.service2, 

    },
  ];

  return (
    <section className="features-section py-5 bg-white">
      <div className="container">
        <div className="row justify-content-center">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="col-md-4 mb-4"
            >
              <div className="card feature-card text-center shadow-sm border-0 p-4 h-100">
                <div className="feature-image">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="img-fluid"
                  />
                </div>
                <h5 className="mt-4 fw-bold">{feature.title}</h5>
                <p className="text-muted">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
