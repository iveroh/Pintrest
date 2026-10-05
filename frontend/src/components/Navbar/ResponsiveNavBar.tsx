import DesktopNavBar from "./DesktopNavBar";
import MobileNavBar from "./MobileNavBar";


export default function ResponsiveNavBar({ onPostClick }: { onPostClick: () => void }) {
    return(
        <>
            <nav
                className="hidden lg:block"
                aria-label="Primary navigation"
            >
                <DesktopNavBar onPostClick={onPostClick} />
            </nav>

            <nav
                className="block lg:hidden"
                aria-label="Primary navigation"
            >
                <MobileNavBar onPostClick={onPostClick} />
            </nav>
        </>
    )
}