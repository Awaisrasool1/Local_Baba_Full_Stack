import React, { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FoodMenu.css";
import { Plus, Search } from "lucide-react";
import { Navbar } from "../../../components";
import { useNavigate } from "react-router-dom";
import { get_categories, get_restaurant_products } from "../../../services";

const RestaurantMenu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState<any>([]);
  const [fade, setFade] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const nav = useNavigate();

  const handleCategoryChange = (category: string) => {
    setFade(false);
    setTimeout(() => {
      setActiveCategory(category);
      setPage(1);
      setFoodItems([]);
      setFade(true);
    }, 100);
  };

  useEffect(() => {
    setFade(true);
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      fetchFoodItems(page, activeCategory);
    }
  }, [page, activeCategory]);

  const fetchCategories = async () => {
    try {
      const res = await get_categories();
      if (res.status === 200) {
        setCategories(res.data);
        setActiveCategory(res.data[0].Name);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFoodItems = useCallback(
    async (pageNumber: number, category: string) => {
      try {
        const res = await get_restaurant_products(pageNumber, 3, category);
        if (res.data?.products?.length > 0) {
          console.log(res.data?.products?.length);
          setFoodItems((prevItems: any) => [
            ...prevItems,
            ...res?.data?.products,
          ]);
          setHasMore(res.data?.products?.length > 0);
        }
      } catch (err) {
        console.log("Error fetching products:", err);
      }
    },
    []
  );

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, hasMore]);

  return (
    <div className="container my-4">
      <Navbar title="Menu" subTitle="Here is customer review" />

      <div className="align-items-center justify-content-between d-md-flex mb-4">
        <div
          className="position-relative me-4"
          style={{ width: "60%", maxWidth: "100%" }}
        >
          <input
            type="text"
            className="form-control border-0 bg-light pe-4"
            placeholder="Search by date, restaurant"
          />
          <Search
            className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted cursor-pointer"
            size={18}
          />
        </div>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light d-flex align-items-center me-3"
            onClick={() => nav("/add-Menu")}
          >
            <Plus size={18} className="me-2" />
            <span>Add Menu</span>
          </button>
        </div>
      </div>

      <div className="d-flex category-nav mb-4">
        {categories.map((category: any) => (
          <button
            key={category.Name}
            onClick={() => handleCategoryChange(category.Name)}
            className={`category-btn ${
              activeCategory === category.Name ? "active" : ""
            }`}
          >
            {category.Name}
          </button>
        ))}
      </div>

      <div className={`row ${fade ? "fade-in" : ""}`}>
        {foodItems.map((item: any) => (
          <div key={item.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card food-card h-100">
              <img
                src={item.image}
                className="card-img-top h-75"
                alt={item.name}
              />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text text-muted">{item.category}</p>
                <div className="d-flex flex-column align-items-start price-section">
                  {item.discountedPrice < item.originalPrice && (
                    <span className="badge bg-danger discount-badge">
                      Discount
                    </span>
                  )}
                  <span className="original-price text-muted">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                  <span className="discounted-price">
                    ${item.discountedPrice.toFixed(2)}
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <span className="rating">
                    {"⭐".repeat(item.rating)}{" "}
                    <span className="text-muted">({item.reviews} Reviews)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;
