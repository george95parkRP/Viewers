import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, AboutContent, withModal } from '@ohif/ui';
//
import { UserPreferences } from './../UserPreferences';
import { servicesManager } from '../../App.js';
import OHIFLogo from '../OHIFLogo/OHIFLogo.js';
import './Header.css';

function Header(props) {
  const {
    t,
    user,
    userManager,
    modal: { show },
    useLargeLogo,
    linkPath,
    linkText,
    location,
    children,
  } = props;

  const [options, setOptions] = useState([]);
  const hasLink = linkText && linkPath;

  useEffect(() => {
    const optionsValue = [
      {
        title: t('About'),
        icon: { name: 'info' },
        onClick: () =>
          show({
            content: AboutContent,
            title: t('OHIF Viewer - About'),
          }),
      },
      {
        title: t('Preferences'),
        icon: {
          name: 'user',
        },
        onClick: () =>
          show({
            content: UserPreferences,
            title: t('User Preferences'),
          }),
      },
    ];

    if (user && userManager) {
      optionsValue.push({
        title: t('Logout'),
        icon: { name: 'power-off' },
        onClick: () => userManager.signoutRedirect(),
      });
    }

    setOptions(optionsValue);
  }, [setOptions, show, t, user, userManager]);

  return (
    <>
      <div className="notification-bar">{t('INVESTIGATIONAL USE ONLY')}</div>
      <div
        className={classNames('entry-header', { 'header-big': useLargeLogo })}
      >
        <div className="header-left-box">
          {location && location.studyLink && (
            <Link
              to={location.studyLink}
              className="header-btn header-viewerLink"
            >
              {t('Back to Viewer')}
            </Link>
          )}

          {children}

          {hasLink && (
            <Link
              className="header-btn header-studyListLinkSection"
              to={() => {
                return {
                  pathname: linkPath,
                  state: { studyLink: location.pathname },
                };
              }}
              onClick={() => {
                if (linkText === 'Study List') {
                  const { IntegrationService } = servicesManager.services;
                  const { STUDY_CLOSED } = IntegrationService.EVENTS;
                  IntegrationService._broadcastChange(STUDY_CLOSED);
                  // console.log('study closing', linkPath, location);
                }
              }}
            >
              {t(linkText)}
            </Link>
          )}
        </div>

        <div className="header-menu">
          <span className="research-use">{t('INVESTIGATIONAL USE ONLY')}</span>
          <Dropdown title={t('Options')} list={options} align="right" />
        </div>
      </div>
    </>
  );
}

Header.propTypes = {
  // Study list, /
  linkText: PropTypes.string,
  linkPath: PropTypes.string,
  useLargeLogo: PropTypes.bool,
  //
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
  t: PropTypes.func.isRequired,
  userManager: PropTypes.object,
  user: PropTypes.object,
  modal: PropTypes.object,
};

Header.defaultProps = {
  useLargeLogo: false,
  children: OHIFLogo(),
};

export default withTranslation(['Header', 'AboutModal'])(
  withRouter(withModal(Header))
);
