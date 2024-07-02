export const defaultCode: any =
  'import { PinataSDK } from "@pinata/sdk";\n' +
  "\n" +
  "const pinata = new PinataSDK({\n" +
  "  pinataJwt: process.env.PINATA_JWT!,\n" +
  '  pinataGateway: "snippets.mypinata.cloud",\n' +
  "});\n" +
  "\n" +
  "async function upload() {\n" +
  "  try {\n" +
  '    const file = new File(["Sharing code with IPFS"], "snippet.txt", { type: "text/plain" });\n' +
  "    const data = await pinata.upload.file(file);\n" +
  "    console.log(data);\n" +
  "  } catch (error) {\n" +
  "    console.log(error);\n" +
  "  }\n" +
  "}\n" +
  "\n" +
  "await upload();\n";
