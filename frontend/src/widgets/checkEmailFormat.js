import isEmail from 'validator/es/lib/isEmail';

export default {
  validFormat: (email) => isEmail(email, {
    domain_specific_validation: true,
  }),

  isReadExchangeEmail: (email) => {
    const domainRegex = new RegExp('@read.exchange');
    return domainRegex.test(email);
  },

  domainReachable: () => {

  },
};
