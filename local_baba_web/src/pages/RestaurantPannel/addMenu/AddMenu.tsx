import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Badge,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createProduct, get_categories, uploadImage } from "../../../services";

interface Ingredient {
  id: string;
  name: string;
}

interface ProductFormData {
  title: string;
  category: string;
  ingredients: Ingredient[];
  description: string;
  originalPrice: number;
  discountedPrice: number;
  image?: File;
}

const AddMenu: React.FC = () => {
  const nav = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    category: "",
    ingredients: [],
    description: "",
    originalPrice: 0,
    discountedPrice: 0,
  });
  const [newIngredient, setNewIngredient] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!imagePreview) {
      setError("Please Select Image");
      return false;
    }
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.category) {
      setError("Category is required");
      return false;
    }
    if (formData.originalPrice <= 0) {
      setError("Original price must be greater than 0");
      return false;
    }
    if (formData.discountedPrice >= formData.originalPrice) {
      setError("Discounted price must be less than original price");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    return true;
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setFormData({
        ...formData,
        ingredients: [
          ...formData.ingredients,
          { id: Date.now().toString(), name: newIngredient.trim() },
        ],
      });
      setNewIngredient("");
    }
  };

  const removeIngredient = (id: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((ing) => ing.id !== id),
    });
  };

  const preparePayload = async () => {
    let imageUrl = "";
    if (formData.image) {
      try {
        const newFormData = new FormData();
        newFormData.append("image", formData.image);
        const image = await uploadImage(newFormData);
        imageUrl = image.imageUrl;
      } catch (err) {
        console.log(err);
        throw new Error("Failed to upload image");
      }
    }
    return {
      title: formData.title,
      category_id: formData.category,
      ingredients: formData.ingredients.map((ing) => ({ name: ing.name })),
      description: formData.description,
      originalPrice: formData.originalPrice,
      discountedPrice: formData.discountedPrice,
      image: imageUrl,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      console.log(validateForm);
      return;
    }
    try {
      const payload = await preparePayload();
      const res = await createProduct(payload);
      if (res.status == "success") {
        setSuccess("product create successfuly");
        setFormData({
          title: "",
          category: "",
          ingredients: [],
          description: "",
          originalPrice: 0,
          discountedPrice: 0,
        });
        setImagePreview(null);
      }
    } catch (err: any) {
      console.log(err);
      setError(err.response);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await get_categories();
      if (res.status == 200) {
        setCategories(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="py-4">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" onClose={() => setError(null)} dismissible>
          {success}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <div className="border rounded p-3 text-center">
                <Form.Control
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml"
                  onChange={handleImageUpload}
                  className="d-none"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="btn btn-outline-primary mb-0"
                >
                  Choose File
                </label>
                <div className="text-muted mt-2">
                  <small>
                    Image must be less than 5MB (jpg, png, svg format)
                  </small>
                </div>
              </div>
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    style={{ maxWidth: "100%", height: "200px" }}
                  />
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Select Category</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select</option>
                {categories
                  ?.filter((val: any) => val.Name != "All")
                  ?.map((category: any) => (
                    <option key={category.id} value={category.ID}>
                      {category.Name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Ingredients</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Form.Control
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Add ingredient"
                />
                <Button variant="outline-secondary" onClick={addIngredient}>
                  Add
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {formData.ingredients.map((ing) => (
                  <Badge
                    key={ing.id}
                    bg="light"
                    text="dark"
                    className="d-flex align-items-center p-2"
                  >
                    {ing.name}
                    <Button
                      variant="link"
                      className="p-0 ms-2"
                      onClick={() => removeIngredient(ing.id)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Original Price (₹)</Form.Label>
              <Form.Control
                type="number"
                value={formData.originalPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalPrice: Number(e.target.value),
                  })
                }
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Discounted Price (₹)</Form.Label>
              <Form.Control
                type="number"
                value={formData.discountedPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountedPrice: Number(e.target.value),
                  })
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </Form.Group>
        <div className="d-flex justify-content-end gap-2">
          <Button
            onClick={() => nav("/restaurant-Menu")}
            variant="outline-secondary"
          >
            Back
          </Button>
          <Button variant="outline-secondary" type="submit">
            Add
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddMenu;
