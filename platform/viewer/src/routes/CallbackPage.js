import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { CallbackComponent } from 'redux-oidc';
import { servicesManager } from '../App';

class CallbackPage extends Component {
  static propTypes = {
    userManager: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  render() {
    return (
      <CallbackComponent
        userManager={this.props.userManager}
        successCallback={() => {
          const { IntegrationService } = servicesManager.services;
          const { USER_LOGIN } = IntegrationService.EVENTS;
          IntegrationService._broadcastChange(USER_LOGIN);
          const { pathname, search = '' } = JSON.parse(
            sessionStorage.getItem('ohif-redirect-to')
          );

          this.props.history.push({ pathname, search });
        }}
        errorCallback={error => {
          //this.props.history.push("/");
          throw new Error(error);
        }}
      >
        <div>Redirecting...</div>
      </CallbackComponent>
    );
  }
}

export default withRouter(CallbackPage);
