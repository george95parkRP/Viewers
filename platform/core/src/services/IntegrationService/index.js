import IntegrationService from './IntegrationService';

export default {
  name: 'IntegrationService',
  create: ({ configuration = {} }) => {
    return new IntegrationService();
  },
};
