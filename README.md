This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment Variables

1. `MONGO_URL`

   1. Required
   2. You can install mongodb locally or use MongoDB Atlas which provides free 512MB hosted databases. https://www.mongodb.com/cloud/atlas
   3. The url will look something like this usually: `mongodb://localhost/<db_name>` or `mongodb+srv://<user>:<pass>@<host>/<database>`
   4. Make sure the database exists. Use [Compass](https://www.mongodb.com/products/compass) or a similar tool to create the database if needed.

2. `IMGBB_API_KEY`

   1. Required for upload functionality to work
   2. Can be obtained from here: https://api.imgbb.com

3. `NEXT_APP_TINY_MCE_API_KEY`

   1. Required if running on any origin besides localhost or https://applications.stuysu.org
   2. Will show warning on TinyMCE editor otherwise
   3. Can be obtained here: https://www.tiny.cloud

4. `NEXT_APP_GOOGLE_CLIENT_ID`

   1. Required if running on any origin besides localhost or https://applications.stuysu.org
   2. More information here: https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid
   3. The Drive API must be enabled for the client that's used for this project: https://developers.google.com/drive/api/v3/enable-drive-api

5. `NEXT_APP_GOOGLE_ANALYTICS_ID`
   1. Optional
   2. Must be a Universal ID
   

# Next.JS README:

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
