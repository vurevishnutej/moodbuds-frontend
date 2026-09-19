import { HomeNavbar } from '../../../components/layout/HomeNavbar';
import { MobileNavbar } from '../../../components/layout/MobileNavbar';
import { MobileFooter } from '../../../components/layout/MobileFooter';
import { Footer } from '../../../components/layout/Footer';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';
import { OfferBanner } from '../components/OfferBanner';
import { HeroSlider } from '../components/HeroSlider';
import { MoodCollection } from '../components/MoodCollection';
import { FindYourMood } from '../components/FindYourMood';
import { FeaturedPanels } from '../components/FeaturedPanels';
import { MoodPillStrip } from '../components/MoodPillStrip';
import { MobileHome } from '../components/MobileHome';

export function HomePage() {
  useBodyViewClass('home');
  return (
    <div id="view-home" className="mb-page-fade">
      <div className="mb-mobile-shell">
        <MobileNavbar />
        <MobileHome />
        <MobileFooter />
      </div>

      <div className="mb-desktop-only">
        <div id="page">
          <HomeNavbar />
          <OfferBanner />
          <HeroSlider />
          <div id="side-tab">UP TO 40% OFF ✦</div>
          <MoodCollection />
          <FindYourMood />
          <FeaturedPanels />
          <MoodPillStrip />
        </div>
      </div>

      <div className="mb-desktop-only">
        <Footer />
      </div>
    </div>
  );
}
