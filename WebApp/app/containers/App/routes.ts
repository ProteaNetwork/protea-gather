import { Dashboard } from '@material-ui/icons';
import DashboardContainer from 'containers/DashboardContainer';
import LandingPageContainer from 'containers/LandingPageContainer';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import CreateCommunityContainer from 'containers/CreateCommunityContainer';
import ViewCommunityContainer from 'containers/ViewCommunityContainer';

export interface appRoute {
  name: string;
  path: string;
  component: React.ComponentType;
  isProtected: boolean;
  isNavRequired: boolean;
  routeNavLinkIcon?: React.ComponentType<SvgIconProps>; // Should be provided if Nav is required
}

const routes: appRoute[] = [
  {
    name: 'Landing Page',
    path: '/',
    component: LandingPageContainer,
    isProtected: false,
    isNavRequired: false,
  }, {
    name: 'Dashboard',
    path: '/dashboard',
    component: DashboardContainer,
    isProtected: true,
    isNavRequired: true,
    routeNavLinkIcon: Dashboard,
  },
  {
    name: 'CreateCommunity',
    path: '/communities/create',
    component: CreateCommunityContainer,
    isProtected: true,
    isNavRequired: false,
  },
  {
    name: 'ViewCommunity',
    path: '/communities/:tbcAddress?',
    component: ViewCommunityContainer,
    isProtected: true,
    isNavRequired: false,
  },
];

export default routes;
