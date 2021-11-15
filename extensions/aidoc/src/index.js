export default {
  id: 'aidoc',
  version: '0.1.0',

  preRegistration({ servicesManager }) {
    const { IntegrationService } = servicesManager.services;

    const { STUDY_OPENED, STUDY_CLOSED } = IntegrationService.EVENTS;

    IntegrationService.subscribe(STUDY_OPENED, ({ data }) => {
      if (window.api) {
        window.api.send('study_open', data);
      }
    });

    IntegrationService.subscribe(STUDY_CLOSED, () => {
      if (window.api) {
        window.api.send('study_close');
      }
    });
  },
};
