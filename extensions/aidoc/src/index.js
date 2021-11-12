export default {
  id: 'aidoc',
  version: '0.1.0',

  preRegistration({ servicesManager }) {
    const { IntegrationService } = servicesManager.services;

    const { STUDY_OPENED, STUDY_CLOSED } = IntegrationService.EVENTS;

    IntegrationService.subscribe(STUDY_OPENED, ({ study }) => {
      if (window.api) {
        window.api.send('study_open', study);
      }
    });

    IntegrationService.subscribe(STUDY_CLOSED, () => {
      if (window.api) {
        window.api.send('study_close');
      }
    });
  },
};
