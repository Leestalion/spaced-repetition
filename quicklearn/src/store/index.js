import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {
    createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers';
import reducers from '../reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

// Note: createReactNavigationReduxMiddleware must be run before reduxifyNavigator
const middleware = createReactNavigationReduxMiddleware(
    navStateSelector => "root", //default "root"
    state => state.nav,
);

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['nav', 'form'] // nav and form reducers not persisted.
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
    persistedReducer,
    {},
    compose(applyMiddleware(thunk,middleware))
);

let persistor = persistStore(store);

export {
    store,
    persistor
}
