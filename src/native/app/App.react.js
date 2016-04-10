import * as uiActions from '../../common/ui/actions';
import Component from 'react-pure-render/component';
import Header from './Header.react';
import Menu from './Menu.react';
import React, { Navigator, PropTypes, StatusBarIOS, View, Dimensions } from 'react-native';
import SideMenu from 'react-native-side-menu';
import linksMessages from '../../common/app/linksMessages';
import routes from '../routes';
import styles from './styles';
import start from '../../common/app/start';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, intlShape } from 'react-intl';
import FBLogin from 'react-native-facebook-login';
import { firebaseActions } from '../../common/lib/redux-firebase';

const deviceScreen = Dimensions.get('window');

class App extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    device: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    nativeLogin: PropTypes.func.isRequired,
    onSideMenuChange: PropTypes.func.isRequired,
    toggleSideMenu: PropTypes.func.isRequired,
    ui: PropTypes.object.isRequired
  };

  static configureScene(route) {
    return route.animationType || Navigator.SceneConfigs.FloatFromRight;
  }

  constructor(props) {
    super(props);
    this.onNavigatorRef = this.onNavigatorRef.bind(this);
    this.onRouteChange = this.onRouteChange.bind(this);
    this.onSideMenuChange = this.onSideMenuChange.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.processLogin = this.processLogin.bind(this);
  }

  onNavigatorRef(component) {
    this.navigator = component;
  }

  onRouteChange(route) {
    this.navigator.replace(routes[route]);
    this.props.toggleSideMenu();
  }

  onSideMenuChange(isOpen) {
    const { device, onSideMenuChange } = this.props;
    if (device.platform === 'ios') {
      StatusBarIOS.setHidden(isOpen, true);
    }
    onSideMenuChange(isOpen);
  }

  getTitle(route) {
    const { intl } = this.props;
    switch (route) {
      case routes.home: return intl.formatMessage(linksMessages.home);
      case routes.intl: return intl.formatMessage(linksMessages.intl);
      case routes.todos: return intl.formatMessage(linksMessages.todos);
    }
    throw new Error('Route not found.');
  }

  processLogin(data) {
    this.props.nativeLogin(data.credentials.token);
  }

  renderScene(route) {
    const { toggleSideMenu } = this.props;
    return (
      <View style={[styles.sceneView, route.style]}>
        <Header
          title={this.getTitle(route)}
          toggleSideMenu={toggleSideMenu}
        />
        <route.Page />
      </View>
    );
  }

  renderLogin() {
    return (
      <View style={[styles.centeredView, { paddingBottom: 64 }]}>
        <FBLogin style={{ marginBottom: 10, }}
          permissions={['email', 'user_friends']}
          onLogin={(data) => {
            console.log('Logged in!');
            this.processLogin(data);
            console.log(data);
          }}
          onLogout={() => {
            console.log("Logged out.");
          }}
          onLoginFound={(data) => {
            console.log("Existing login found.");
            this.processLogin(data);
            console.log(data);
          }}
        />
      </View>);
  }

  renderApp() {
    const { ui } = this.props;

    return (
      <SideMenu
        disableGestures
        isOpen={ui.isSideMenuOpen}
        menu={
          <Menu onRouteChange={this.onRouteChange} />
        }
        onChange={this.onSideMenuChange}
        style={styles.container}
        openMenuOffset={deviceScreen.width * 1 / 3}
      >
        <Navigator
          configureScene={App.configureScene}
          initialRoute={routes.home}
          ref={this.onNavigatorRef}
          renderScene={this.renderScene}
          style={styles.container}
        />
      </SideMenu>
    );
  }

  render() {
    const { auth } = this.props;

    return auth.isLoggedIn ? this.renderApp() : this.renderLogin();
  }

}

App = injectIntl(App);

/*
App = connect(state => ({
  device: state.device,
  ui: state.ui
}), (dispatch) => ({
  firebaseActions: bindActionCreators(firebaseActions, dispatch),
  uiActions: bindActionCreators(uiActions, dispatch)
}))(App);
*/

App = connect(state => ({
  auth: state.auth,
  device: state.device,
  ui: state.ui
}), Object.assign({}, firebaseActions, uiActions))(App);

export default start(App);
