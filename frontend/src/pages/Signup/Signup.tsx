import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AuthAlert from "./components/AuthAlert";
import { SignupForm } from "./components/signup-form";

type SignupProps = {
  alert?: boolean;
};

function Signup({ alert }: SignupProps) {
  const location = useLocation();
  const locationState = location.state as { showAlert?: boolean } | null;

  const [showAlert, setShowAlert] = useState(
    alert || locationState?.showAlert || false
  );

  useEffect(() => {
    if (alert && location.pathname !== "/signin" && location.pathname !== "/signup") {
      setShowAlert(true);
    }

    if (locationState?.showAlert) {
      setShowAlert(true);
    }
  }, [location.pathname, alert, locationState?.showAlert]);

  return (
    <main
      className="bg-muted flex min-h-svh flex-col items-center justify-center sm:p-20 sm:pt-32 pb-16 pt-8"
    >
      {showAlert && (
        <div
          className="w-full max-w-sm md:max-w-5xl mb-4"
          role="alert"
          aria-live="assertive"
        >
          <AuthAlert onDismiss={() => setShowAlert(false)} />
        </div>
      )}

      <div className="w-full max-w-sm md:max-w-5xl">
        <SignupForm />
      </div>
    </main>
  );
}

export default Signup;
