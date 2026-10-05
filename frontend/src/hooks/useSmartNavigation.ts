import { useNavigate, useLocation } from "react-router-dom";

export const useSmartNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateTo = (path: string) => {
    if (location.pathname === path) {
      // If already on the page, smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to the new page
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return { navigateTo, navigate, location };
};
