import { useState, useEffect } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { setCurrentUser, getCurrentUser } from "../utils/auth";

// Import Components
import LoginForm from "../components/Login/LoginForm";
import SignupForm from "../components/Login/SignupForm";
import TermsModal from "../components/Login/TermsModal";
import ForgotPasswordModal from "../components/Login/ForgotPasswordModal";
import DemoUsers from "../components/Login/DemoUsers";

// Import Utilities
import {
  initializeDemoUsers,
  validateLoginForm,
  validateSignupForm,
  findUserByCredentials,
  createNewUser,
  checkUserExists,
  saveUserToStorage,
  removePasswordFromUser,
  generateResetCode,
  saveResetCode,
  validateResetCode,
  updateUserPassword,
  redirectBasedOnRole,
} from "../components/Login/utils";

import "../styles/pages/Login.css";

const Login = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    receiveRecommendations: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      redirectBasedOnRole(user, navigate);
    }

    // Check URL for login/signup parameters
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get("signup") === "true") {
      setIsLoginForm(false);
    } else {
      setIsLoginForm(true);
    }

    // Initialize demo users
    initializeDemoUsers();
  }, [location, navigate]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = validateLoginForm(loginData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Find user in stored users
    const user = findUserByCredentials(loginData.username, loginData.password);

    if (user) {
      // Remove password from user object before storing
      const userWithoutPassword = removePasswordFromUser(user);

      if (loginData.rememberMe) {
        localStorage.setItem("rememberUser", "true");
      }

      setCurrentUser(userWithoutPassword);
      redirectBasedOnRole(userWithoutPassword, navigate);
    } else {
      setFormErrors({ general: "Invalid username or password" });
    }
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const errors = validateSignupForm(signupData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    // Check if user already exists
    if (checkUserExists(signupData.username, signupData.email)) {
      setFormErrors({ general: "Username or email already exists" });
      return;
    }

    // Create new user
    const newUser = createNewUser(signupData);
    
    // Save user to storage
    saveUserToStorage(newUser);

    // Remove password before setting current user
    const userWithoutPassword = removePasswordFromUser(newUser);
    setCurrentUser(userWithoutPassword);

    // Redirect to marketplace with welcome message
    navigate("/", { state: { welcome: true } });
  };

  const handleForgotPasswordSubmit = (data) => {
    const { step, email, resetCode, newPassword, confirmNewPassword, onSuccess, onError } = data;

    // Step 1: Submit email
    if (step === 1) {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        onError("Please enter a valid email address");
        return;
      }

      // Check if email exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userExists = users.some((user) => user.email === email);

      if (!userExists) {
        onError("No account found with this email address");
        return;
      }

      // Generate and save reset code
      const code = generateResetCode();
      saveResetCode(email, code);

      onSuccess(`Reset code has been sent to ${email}. Use code: ${code}`);
    }

    // Step 2: Verify code
    else if (step === 2) {
      if (!validateResetCode(email, resetCode)) {
        onError("Invalid reset code. Please try again.");
        return;
      }

      onSuccess("Code verified! Please enter your new password.");
    }

    // Step 3: Set new password
    else if (step === 3) {
      if (!newPassword) {
        onError("Please enter a new password");
        return;
      }

      if (newPassword.length < 8) {
        onError("Password must be at least 8 characters");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        onError("Passwords do not match");
        return;
      }

      // Update password
      if (updateUserPassword(email, newPassword)) {
        onSuccess("Password reset successful! You can now login with your new password.");
      } else {
        onError("User not found");
      }
    }
  };

  const handleLoginInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSignupInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const showSignupForm = () => {
    setIsLoginForm(false);
    setFormErrors({});
  };

  const showLoginForm = () => {
    setIsLoginForm(true);
    setFormErrors({});
  };

  return (
    <div className="login-page">
      <TermsModal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        onAgree={() => {
          setSignupData((prev) => ({ ...prev, agreeTerms: true }));
          setShowTermsModal(false);
        }}
      />

      <ForgotPasswordModal
        show={showForgotPasswordModal}
        onHide={() => setShowForgotPasswordModal(false)}
        onSubmit={handleForgotPasswordSubmit}
      />

      {/* Login/Signup Content */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="form-container shadow-sm">
              <Card.Body className="p-4">
                {isLoginForm ? (
                  <LoginForm
                    loginData={loginData}
                    formErrors={formErrors}
                    onInputChange={handleLoginInputChange}
                    onSubmit={handleLoginSubmit}
                    onForgotPassword={() => setShowForgotPasswordModal(true)}
                    onSwitchToSignup={showSignupForm}
                  />
                ) : (
                  <SignupForm
                    signupData={signupData}
                    formErrors={formErrors}
                    onInputChange={handleSignupInputChange}
                    onSubmit={handleSignupSubmit}
                    onShowTerms={() => setShowTermsModal(true)}
                    onSwitchToLogin={showLoginForm}
                  />
                )}
              </Card.Body>
            </Card>

            {/* Demo Users Card (Optional - for development) */}
            {process.env.NODE_ENV === "development" && <DemoUsers />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;