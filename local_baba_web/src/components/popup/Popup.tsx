import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { get_categories } from "../../services";
import { CustomButton } from "../customButton";
import MapCard from "../mapCard/MapCard";

interface UserType {
  id: string;
  Name: string;
}
interface FormData {
  email: string;
  name: string;
  password: string;
  phoneNumber: string;
  userType: string;
  openingTime: string;
  closingTime: string;
}

interface PopupFormProps {
  setFormData: (i: FormData) => void;
  setLatLong: (i: any) => void;
  handleClose: () => void;
  onSubmit: () => void;
  formData: FormData;
  show: boolean;
  latLong: any;
}

const PopupForm: React.FC<PopupFormProps> = ({
  show,
  formData,
  setFormData,
  onSubmit,
  handleClose,
  latLong,
  setLatLong,
}) => {
  const [emailError, setEmailError] = useState<string>("");
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        const response = await get_categories();
        if (response.status == 200) {
          setUserTypes(response.data);
        }
      } catch (error) {
        console.error("Error fetching user types:", error);
      }
    };

    fetchUserTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError("");
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      style={{ width: "100%", height: "100%" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Restaurant Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter Name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                handleChange(e as React.ChangeEvent<HTMLInputElement>)
              }
              required
            />
          </Form.Group>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleChange(e as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                />
                {emailError && (
                  <Form.Text className="text-danger">{emailError}</Form.Text>
                )}
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleChange(e as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleChange(e as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formUserType">
                <Form.Label>User Type</Form.Label>
                <Form.Control
                  as="select"
                  name="userType"
                  value={formData.userType}
                  onChange={(e) =>
                    handleChange(
                      e as unknown as React.ChangeEvent<HTMLSelectElement>
                    )
                  }
                  required
                >
                  <option value="">Select Type</option>
                  {userTypes?.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.Name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Group controlId="formOpeningTime">
                <Form.Label>Opening Time</Form.Label>
                <Form.Control
                  type="time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={(e) =>
                    handleChange(e as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formClosingTime">
                <Form.Label>Closing Time</Form.Label>
                <Form.Control
                  type="time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={(e) =>
                    handleChange(e as React.ChangeEvent<HTMLInputElement>)
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <MapCard setLatLong={setLatLong} latLong={latLong} />
      <Modal.Footer>
        <Row style={{ width: "100%" }}>
          <Col>
            <CustomButton
              bgStyle={{ backgroundColor: "rgb(252, 47, 47)" }}
              title="Close"
              onPress={handleClose}
            />
          </Col>
          <Col>
            <CustomButton title="Save Changes" onPress={onSubmit} />
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default PopupForm;
