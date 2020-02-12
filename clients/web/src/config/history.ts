/**
 * Custom History for Routes
 */

import { createBrowserHistory, History } from 'history';

/**
 *  Create a user-defined history object for browser navigation
 *  without relying on BrowserRoute
 */
const history: History = createBrowserHistory();

export default history;
