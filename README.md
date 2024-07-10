# Snippets.so
![cover](https://www.snippets.so/og.png)
No ads, no fuss, just code

## Development Setup

Clone the repo and install

```
git clone https://github.com/stevedylandev/snippets && cd snippets && npm install
```

Create a `.env.local` file with the following variables

```
PINATA_JWT= # created at https://app.pinata.cloud/developers/api-keys
GATEWAY_URL= # Located at https://app.pinata.cloud/gateway
```

Start up the server with `npm run dev`

## Ports

### API

```bash
curl --location 'https://www.snippets.so/api/upload' \
--header 'Content-Type: application/json' \
--data '{
  "content": "console.log(\"hello world!\")",
  "name": "hello.ts",
  "lang": "typescript"
}'

```
[List of supported languages](https://github.com/stevedylandev/snippets/blob/main/lib/languages.ts)

```
https://snippets.so/snip/{IpfsHash}
```

### CLI

```
brew install stevedylandev/snippets-cli/snippets-cli
```

For other installs check out the [Github repo](https://github.com/stevedylandev/snippets-cli)

**Usage**

```
snip hello.ts
```

## Contact

Feedback? [hello@stevedylan.dev](mailto:hello@stevedylan.dev)
Like what you see? [Eth Address](https://rainbow.me/stevedylandev.eth) [Buy me a coffee](https://buymeacoffee.com/stevedylandev)
