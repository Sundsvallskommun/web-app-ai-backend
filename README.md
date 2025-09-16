# AI backend

Proxy backend för kommunikation med Eneo via api gateway,
samt vissa Azure-funktioner.

## APIer som används

Dessa APIer används i projektet, applikationsanvändaren i WSO2 måste prenumerera på dessa.

| API             | Version |
| --------------- | ------: |
| SimulatorServer |     2.0 |
| Eneo-Sundsvall  |      v1 |

## Utveckling

### Krav

- Node >= 16 LTS
- Yarn

### Steg för steg

1. Klona ner repot till en mapp "<web-app-projektnamn>" och skapa nytt git repo

```
npx tiged --mode=git git@github.com:Sundsvallskommun/web-app-starter.git <web-app-projektnamn>
cd <web-app-projektnamn>
git init
```

2. Installera dependencies för både `backend` och `admin`

```
cd admin
yarn install

cd backend
yarn install
```

3. Skapa .env-fil för `admin`

```
cd admin
cp .env-example .env
```

Redigera `.env` för behov, för utveckling bör exempelvärdet fungera.

4. Skapa .env-fil för `backend`

```
cd backend
cp .env.example.local .env.development.local
cp .env.example.local .env.test.local
```

redigera `.env.development.local` för behov. URLer, nycklar och cert behöver fyllas i korrekt.

- `CLIENT_KEY` och `CLIENT_SECRET` måste fyllas i för att APIerna ska fungera, du måste ha en applikation från WSO2-portalen
- `SAML_ENTRY_SSO` behöver pekas till en SAML IDP
- `SAML_IDP_PUBLIC_CERT` ska stämma överens med IDPens cert
- `SAML_PRIVATE_KEY` och `SAML_PUBLIC_KEY` behöver bara fyllas i korrekt om man kör mot en riktig IDP

För att kunna använda Azure via proxyn måste du fylla i följande

- `AZURE_REGION`
- `AZURE_SUBSCRIPTION_KEY`
- `AZURE_TRANSLATOR_KEY`

`ENEO_SALT` används för att generera hashar som dina appar använder för prata med Eneo via denna proxy.
Om din applikation genererar hashar måste ni ha samma saltvärde.

5. Initiera databas för backend

```
cd backend
yarn prisma:generate
yarn prisma:migrate
```
