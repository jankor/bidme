import Component from 'react-pure-render/component';
import React, { Text, View, ListView } from 'react-native';
import appStyles from '../app/styles';
import { FormattedMessage, defineMessages } from 'react-intl';


export default class Page extends Component {

  render() {
    return (
      <View style={[appStyles.centeredView, { paddingBottom: 64 }]}>
        <Text style={[appStyles.centered, appStyles.paragraph]}>
          ZPRAVY
        </Text>
      </View>
    );
  }

}
