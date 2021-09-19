export default applicant => {
  const results = applicant.ownerDocument().results;

  return results.map[results.anonymityId] || "unknown";
};
