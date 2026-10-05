import { CheckCircle2Icon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Link } from "react-router-dom";

type AuthAlertProps = {
  onDismiss?: () => void;
};

export default function AuthAlert({ onDismiss }: AuthAlertProps) {
  return (
    <div className="fixed top-20 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-lg h-fit pointer-events-auto animate-in slide-in-from-top duration-500 shake-x">
        <Alert
          className="shadow-lg border-2 bg-card text-primary relative"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          aria-labelledby="auth-alert-title"
          aria-describedby="auth-alert-description"
        >
          <button
            onClick={onDismiss}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close alert"
            type="button"
          >
            ✕
          </button>

          <CheckCircle2Icon aria-hidden="true" focusable="false" />

          <AlertTitle id="auth-alert-title">
            Account signup required
          </AlertTitle>

          <AlertDescription
            id="auth-alert-description"
            className="inline"
          >
            Please sign up or{" "}
            <Link
              to="/signin"
              className="underline hover:text-primary inline"
            >
              login
            </Link>{" "}
            to your account to access all features.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
