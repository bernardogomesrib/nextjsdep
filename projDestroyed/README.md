
```bash
# primeiro passo:
crie o arquivo .env com as chaves:
DATABASE_URL="mysql://usuario_do_seu_mysql:senha_do_seu_mysql@localhost:3306/seu_banco"
AUTH_SECRET= segredo que você quizer por, pode cabecear o teclado
COSMOS_TOKEN= <- token da cosmos adquira um: https://cosmos.bluesoft.com.br/
npm i
# then
npx prisma db push
# then
npx prisma db seed
# then
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
