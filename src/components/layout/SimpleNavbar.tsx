import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../common/Icons';

interface SimpleNavbarProps {
  navId: string;
  innerClassName: string;
  backClassName: string;
  logoClassName: string;
  rightClassName: string;
  backLabel?: string;
  backTo?: string;
  right?: ReactNode;
}

export function SimpleNavbar({
  navId,
  innerClassName,
  backClassName,
  logoClassName,
  rightClassName,
  backLabel = 'Continue shopping',
  backTo,
  right,
}: SimpleNavbarProps) {
  const navigate = useNavigate();

  const goBack = () => {
    if (backTo) {
      navigate(backTo);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <nav id={navId}>
      <div className={innerClassName}>
        <button type="button" className={backClassName} onClick={goBack}>
          <ArrowLeftIcon />
          {backLabel}
        </button>
        <Link className={logoClassName} to="/">Mood<em>Buds</em></Link>
        <div className={rightClassName}>{right}</div>
      </div>
    </nav>
  );
}
