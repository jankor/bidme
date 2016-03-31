import 'react-native-browser-polyfill';
import App from './app/App.react';
import Component from 'react-pure-render/component';
import React, { AppRegistry, Platform } from 'react-native';
//import config from './config';
import configureStore from '../common/configureStore';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
//import messages from './messages';
import { Provider } from 'react-redux';

require('../server/intl/polyfillLocales')(self, ['En']);

export default function index() {
  const initialState = {
    config: {
      appName: 'bidme',
      firebaseUrl: 'https://test.firebaseio.com'
    },
    intl: {
      // TODO: Detect native current locale.
      currentLocale: 'En',
      locales: ['En'],
      messages: {}
    },
    device: {
      platform: Platform.OS
    }
  };
  const store = configureStore({ createEngine, initialState });

  class Root extends Component {
    render() {
      return (
        <Provider store={store}>
          <App />
        </Provider>
      );
    }
  }

  AppRegistry.registerComponent('Este', () => Root);
}
