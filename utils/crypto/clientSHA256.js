export default async function clientSHA256(message) {
  // Encode the message as a Uint8Array
  const msgUint8 = new TextEncoder().encode(message);

  // Hash the message and store the BufferArray result
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);

  // Convert the BufferArray to a normal array so we can map throuh
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert the bytes to hex values and join them together
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
