import { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { books } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";

// Import Components
import LoadingSpinner from "../components/DeliveryDetails/LoadingSpinner";
import ProgressSteps from "../components/DeliveryDetails/ProgressSteps";
import CartSummary from "../components/DeliveryDetails/CartSummary";
import ShippingAddressForm from "../components/DeliveryDetails/ShippingAddressForm";
import AddressPreview from "../components/DeliveryDetails/AddressPreview";
import ShippingMethodSection from "../components/DeliveryDetails/ShippingMethodSection";
import OrderSummary from "../components/DeliveryDetails/OrderSummary";
import ImportantNote from "../components/DeliveryDetails/ImportantNote";
import FormButtons from "../components/DeliveryDetails/FormButtons";

// Import Utilities
import {
  formatPriceLKR,
  countries,
  shippingMethods,
  validateField,
  calculateOrderSummary,
  generateAddressPreview,
} from "../components/DeliveryDetails/utils";

import "../styles/pages/DeliveryDetails.css";

const DeliveryDetails = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "LK",
    shippingMethod: "standard",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [addressPreview, setAddressPreview] = useState(
    "Enter your address details to see preview"
  );
  const [cartItems, setCartItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 500,
    tax: 0,
    total: 0,
    itemCount: 0,
  });

  const navigate = useNavigate();

  // Load cart data and calculate summary
  const loadCartData = () => {
    const savedCart = JSON.parse(sessionStorage.getItem("checkoutCart")) || [];
    const cartWithDetails = savedCart.map((item) => {
      const book = books.find((b) => b.id === item.id) || {};
      return {
        ...item,
        title: book.title || "Unknown Book",
        author: book.author || "Unknown Author",
        price: book.price || 0,
        image:
          book.image ||
          "https://via.placeholder.com/200x300/DBEAFE/1E3A5F?text=Book+Cover",
      };
    });

    const selectedShipping = shippingMethods[formData.shippingMethod]?.price || 500;
    const summary = calculateOrderSummary(cartWithDetails, selectedShipping);

    setCartItems(cartWithDetails);
    setOrderSummary(summary);
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      showNotification(
        "Please login to proceed with delivery details",
        "warning"
      );
      navigate("/login");
      return;
    }

    // Check if cart has items
    const savedCart = JSON.parse(sessionStorage.getItem("checkoutCart")) || [];
    if (savedCart.length === 0) {
      showNotification("Your cart is empty", "warning");
      navigate("/cart");
      return;
    }

    // Populate user data
    if (user.name) {
      const names = user.name.split(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: names[0] || "",
        lastName: names.slice(1).join(" ") || "",
        email: user.email || "",
      }));
    }

    loadCartData();

    // Load saved address if available
    const savedAddress = JSON.parse(
      localStorage.getItem(`userAddress_${user.id}`)
    );
    if (savedAddress) {
      setFormData((prev) => ({ ...prev, ...savedAddress }));
    }
  }, []);

  useEffect(() => {
    updateAddressPreview();
    loadCartData();
  }, [formData]);

  const updateAddressPreview = () => {
    const preview = generateAddressPreview(formData, countries);
    setAddressPreview(preview);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "Please enter your first name";
    if (!formData.lastName.trim())
      newErrors.lastName = "Please enter your last name";
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim())
      newErrors.phone = "Please enter your phone number";
    if (!formData.address.trim())
      newErrors.address = "Please enter your street address";
    if (!formData.city.trim()) newErrors.city = "Please enter your city";
    if (!formData.state.trim())
      newErrors.state = "Please enter your state/province";
    if (!formData.zipCode.trim())
      newErrors.zipCode = "Please enter your ZIP/postal code";
    if (!formData.country) newErrors.country = "Please select your country";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    if (value.trim() !== "") {
      if (validateField(name, value)) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const showNotification = (message, type = "info") => {
    // Use your existing notification system here
    console.log(`${type}: ${message}`);
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const saveAddress = () => {
    const user = getCurrentUser();
    if (user) {
      const address = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };
      localStorage.setItem(`userAddress_${user.id}`, JSON.stringify(address));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification("Please fix the errors in the form", "danger");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Save address for future use
      saveAddress();

      // Prepare delivery data
      const deliveryData = {
        shipping: formData,
        cartItems: cartItems,
        orderSummary: orderSummary,
        selectedShippingMethod: shippingMethods[formData.shippingMethod],
        timestamp: new Date().toISOString(),
      };

      // Save to session storage
      sessionStorage.setItem("deliveryData", JSON.stringify(deliveryData));

      setLoading(false);
      showNotification(
        "Delivery information saved! Redirecting to payment...",
        "success"
      );

      // Redirect to checkout
      setTimeout(() => {
        navigate("/checkout");
      }, 1000);
    }, 1000);
  };

  const setShippingMethod = (method) => {
    setFormData((prev) => ({ ...prev, shippingMethod: method }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="delivery-details-page">
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="form-container">
              <h2>
                <FontAwesomeIcon icon={faTruck} className="me-2" />
                Delivery Details
              </h2>

              <ProgressSteps currentStep={1} />

              <CartSummary cartItems={cartItems} orderSummary={orderSummary} />

              <Form
                id="deliveryForm"
                className="delivery-form"
                onSubmit={handleSubmit}
              >
                <ShippingAddressForm
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  countries={countries}
                />

                <AddressPreview addressPreview={addressPreview} />

                <ShippingMethodSection
                  shippingMethod={formData.shippingMethod}
                  setShippingMethod={setShippingMethod}
                />

                <OrderSummary orderSummary={orderSummary} />

                <ImportantNote />

                <FormButtons onSubmit={handleSubmit} loading={loading} />
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DeliveryDetails;