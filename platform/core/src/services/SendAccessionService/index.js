import SendAccessionService from './SendAccessionService';

export default {
  name: 'SendAccessionService',
  create: ({ configuration = {} }) => {
    return new SendAccessionService();
  },
};
