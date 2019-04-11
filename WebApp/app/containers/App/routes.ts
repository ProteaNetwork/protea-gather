import { Dashboard } from '@material-ui/icons';
import DashboardContainer from 'containers/DashboardContainer';
import LandingPageContainer from 'containers/LandingPageContainer';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import CreateCommunityContainer from 'containers/CreateCommunityContainer';
import ViewCommunityContainer from 'containers/ViewCommunityContainer';
import CreateEventContainer from 'containers/CreateEventContainer';
import ViewEventContainer from 'containers/ViewEventContainer';
import DiscoverEventsContainer from 'containers/DiscoverEventsContainer';
import DiscoverCommunitiesContainer from 'containers/DiscoverCommunitiesContainer';
import ProfileContainer from 'containers/ProfileContainer';

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
    name: 'Create Community',
    path: '/communities/create',
    component: CreateCommunityContainer,
    isProtected: true,
    isNavRequired: false,
  },
  {
    name: 'View Community',
    path: '/communities/:tbcAddress?',
    component: ViewCommunityContainer,
    isProtected: true,
    isNavRequired: false,
  },
  {
    name: 'Communities',
    path: '/communities/',
    component: DiscoverCommunitiesContainer,
    isProtected: true,
    isNavRequired: true,
  },
  {
    name: 'Create Event',
    path: '/events/:eventManagerAddress?/create/',
    component: CreateEventContainer,
    isProtected: true,
    isNavRequired: false,
  },
  {
    name: 'View Event',
    path: '/events/:eventId?',
    component: ViewEventContainer,
    isProtected: true,
    isNavRequired: false,
  },
  {
    name: 'Events',
    path: '/events/',
    component: DiscoverEventsContainer,
    isProtected: true,
    isNavRequired: true,
  },
  {
    name: 'Profle',
    path: '/profile/:ethAddress?',
    component: ProfileContainer,
    isProtected: true,
    isNavRequired: true,
  },
];

export default routes;
