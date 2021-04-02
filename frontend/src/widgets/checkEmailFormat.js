import isEmail from 'validator/es/lib/isEmail';

export default {
  validFormat: (email) => isEmail(email, {
    domain_specific_validation: true,
  }),

  isCompanyEmail: (email) => {
    const domainRegex = new RegExp('@read.exchange');
    // const domainRegex = new RegExp('@recyda.com');
    return domainRegex.test(email);
  },

  domainReachable: () => {

  },
};
