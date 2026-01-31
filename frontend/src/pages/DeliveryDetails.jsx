import { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import { books, showNotification } from "../utils/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";

// Import Components
import LoadingSpinner from "../components/common/LoadingSpinner";
import ProgressSteps from "../components/common/ProgressSteps";
import CartSummary from "../components/DeliveryDetails/CartSummary";
import ShippingAddressForm from "../components/DeliveryDetails/ShippingAddressForm";
import AddressPreview from "../components/DeliveryDetails/AddressPreview";
import ShippingMethodSection from "../components/DeliveryDetails/ShippingMethodSection";
import OrderSummary from "../components/DeliveryDetails/OrderSummary";
import ImportantNote from "../components/DeliveryDetails/ImportantNote";
import FormButtons from "../components/DeliveryDetails/FormButtons";

// Import Utilities
import {
  countries,
  shippingMethods,
  validateField,
  calculateOrderSummary,
  generateAddressPreview,
} from "../components/DeliveryDetails/utils";

import "../styles/pages/DeliveryDetails.css";

const DEFAULT_FORM_DATA = {
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
};

const safeParseJSON = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getSavedAddress = (userId) => {
  if (!userId) {
    return null;
  }

  return safeParseJSON(localStorage.getItem(`userAddress_${userId}`));
};

const buildInitialFormData = (user) => {
  const baseData = { ...DEFAULT_FORM_DATA };

  if (user?.name) {
    const names = user.name.split(" ");
    baseData.firstName = names[0] || "";
    baseData.lastName = names.slice(1).join(" ") || "";
  }

  if (user?.email) {
    baseData.email = user.email;
  }

  const savedAddress = getSavedAddress(user?.id);
  if (savedAddress) {
    return { ...baseData, ...savedAddress };
  }

  return baseData;
};

const getCheckoutCartItems = () => {
  const savedCart = safeParseJSON(sessionStorage.getItem("checkoutCart")) || [];
  return savedCart.map((item) => {
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
};

const DeliveryDetails = () => {
  const initialUser = getCurrentUser();
  const [currentUser] = useState(initialUser);
  const [formData, setFormData] = useState(() => buildInitialFormData(initialUser));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cartItems] = useState(() => getCheckoutCartItems());

  const orderSummary = useMemo(() => {
    const selectedShipping =
      shippingMethods[formData.shippingMethod]?.price || 500;
    return calculateOrderSummary(cartItems, selectedShipping);
  }, [cartItems, formData.shippingMethod]);

  const addressPreview = useMemo(
    () => generateAddressPreview(formData, countries),
    [formData]
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      showNotification(
        "Please login to proceed with delivery details",
        "warning"
      );
      navigate("/login");
      return;
    }

    // Check if cart has items
    const savedCart = safeParseJSON(sessionStorage.getItem("checkoutCart")) || [];
    if (savedCart.length === 0) {
      showNotification("Your cart is empty", "warning");
      navigate("/cart");
      return;
    }
  }, [currentUser, navigate]);

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

  const saveAddress = () => {
    if (currentUser) {
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
      localStorage.setItem(
        `userAddress_${currentUser.id}`,
        JSON.stringify(address)
      );
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
    return (
      <LoadingSpinner
        message="Processing your delivery information..."
        containerClassName="delivery-loading"
        spinnerClassName="delivery-loading-spinner"
        textClassName="delivery-loading-text"
        textTag="div"
      />
    );
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

              <ProgressSteps currentStep={1} variant="delivery" />

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