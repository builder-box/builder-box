/**
 * Commit header must start with a Jira ticket: `<BBX-NNN>: <subject>`.
 *
 * Example: `BBX-1: update dependencies to fix vulnerabilities`.
 *
 * @param {{ ticket?: string }} parsed
 * @returns {[boolean, string]}
 */
const ticketFormat = (parsed) => [
  /^BBX-\d+$/.test(parsed.ticket ?? ""),
  "header must start with a BBX ticket, e.g. 'BBX-1: update dependencies'",
];

export default {
  plugins: [{ rules: { "ticket-format": ticketFormat } }],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\S+): (.+)$/,
      headerCorrespondence: ["ticket", "subject"],
    },
  },
  rules: {
    "ticket-format": [2, "always"],
    "subject-empty": [2, "never"],
    "header-max-length": [2, "always", 100],
  },
};
