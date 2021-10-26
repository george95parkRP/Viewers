export default {
  id: 'aidoc',
  version: '0.1.0',

  preRegistration({ servicesManager }) {
    const { SendAccessionService } = servicesManager.services;

    const { STUDY_OPENED } = SendAccessionService.EVENTS;

    SendAccessionService.subscribe(STUDY_OPENED, ({ study }) => {
      console.log('STUDY IS: ' + JSON.stringify(study));
    });
  },
};
