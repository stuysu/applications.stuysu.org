export default applicant => {
  const results = applicant.ownerDocument().results;

  return results.map.get(applicant.anonymityId) || "unknown";
};
