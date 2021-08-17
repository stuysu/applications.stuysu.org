mkdir -p certificates/;
openssl req -x509 -out certificates/localhost.crt -keyout certificates/localhost.key   -days 365   -newkey rsa:2048 -nodes -sha256   -subj '/CN=localhost' -extensions EXT -config <(    printf "[dn]
CN=localhost
[req]
distinguished_name = dn
[EXT]
subjectAltName=DNS:localhost
keyUsage=digitalSignature
extendedKeyUsage=serverAuth")