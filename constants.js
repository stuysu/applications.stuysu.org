export const GOOGLE_CLIENT_ID =
  process.env.NEXT_APP_GOOGLE_CLIENT_ID ||
  "945751560363-nldf5eb9kdk122ql6qi7kg8f400ru8t8.apps.googleusercontent.com";

export const TINYMCE_API_KEY =
  process.env.NEXT_APP_TINYMCE_API_KEY ||
  "bzg71o9rxjiw3vfmrlmdu07vif9lfs9j50q8h932ajzahz4b";

export const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_APP_GOOGLE_ANALYTICS_ID || "UA-119929576-4";

// Used for uploading images for TinyEditor
// Not required for testing, unless using image uploads feature
export const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

export const ObjectIdRegex = /^[A-Fa-f0-9]{24}$/;
