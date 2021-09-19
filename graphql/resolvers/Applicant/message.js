export default applicant => {
  const results = applicant.ownerDocument().results;

  const status = results.map.get(applicant.anonymityId) || "unknown";

  if (status === "accepted") {
    return results.acceptanceMessage;
  }

  if (status === "rejected") {
    return results.rejectionMessage;
  }

  return "<p style='text-align: center'>The state of your application is unknown. This means your application wasn't received, or you entered your Anonymity ID incorrectly. <br/><br/>Email the respective department if you think this is a mistake.</p>";
};
