import { Outlet } from 'react-router-dom';
import { SimpleNavbar } from '../../../components/layout/SimpleNavbar';
import { ProfileSidebar } from '../components/ProfileSidebar';
import { useBodyViewClass } from '../../../hooks/useBodyViewClass';

export function ProfileLayout() {
  useBodyViewClass('profile');
  return (
    <div id="view-profile" className="mb-page-fade">
      <SimpleNavbar
        navId="prof-navbar"
        innerClassName="prof-nav-inner"
        backClassName="prof-nav-back"
        logoClassName="prof-nav-logo"
        rightClassName="prof-nav-right"
      />
      <div className="prof-layout">
        <ProfileSidebar />
        <div className="prof-content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
