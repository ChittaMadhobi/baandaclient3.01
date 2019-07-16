// For javasrcipt ... from emailregex.com
//const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// fOR html
const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export default emails => {
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim()) // map function iterates. For every email in the list, trim it
    .filter(email => re.test(email) === false); // email is tested. We negate because in filter, true is kept in output array. Since, we want the failed ones ... we are negating it.

  if (invalidEmails.length) {
    return `These are invalid emails: ${invalidEmails}`;
  }
  return;
};
