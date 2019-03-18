import creatBrowserHistory from 'history/createBrowserHistory';
const history = creatBrowserHistory();
export default history;

export function forwardTo(location) {
  history.push(location);
}
