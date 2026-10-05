import { useEffect, useState } from "react";


export default function useResponsiveSize() {

    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
          const handleResize = () => setIsMobileView(window.innerWidth < 1024)
          handleResize()
          window.addEventListener("resize", handleResize)
          return () => window.removeEventListener("resize", handleResize)
        }, [])

    return { isMobileView };
}