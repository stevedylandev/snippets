"use client";

import Link from "next/link";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { InfoCircledIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";
import Image from "next/image";

export function Header() {
	return (
		<div className="flex items-center justify-between mt-4 w-[350px] md:w-[600px] lg:w-[750px] mb-4">
			<Dialog>
				<div className="flex flex-col justify-content items-start gap-0 text-sm mt-6">
					<Link className="font-commitMono text-2xl font-bold" href="/">
						Snippets.so
					</Link>
					<div className="flex gap-2 items-center text-xs">
						<p>Powered by</p>
						<Link href="https://pinata.cloud" target="_blank">
							<img className="h-10" src="/pinata.png" alt="pinata" />
						</Link>
						<p className="pt-1 text-xs">
							built by{" "}
							<Link
								className="font-bold underline"
								href="https://stevedylan.dev"
								target="_blank"
							>
								Steve
							</Link>
						</p>
					</div>
				</div>
				<div className="flex gap-4 items-center">
					<Button
						variant="outline"
						className="h-7 w-7 flex items-center"
						size="icon"
						asChild
					>
						<Link
							href="https://github.com/stevedylandev/snippets"
							target="_blank"
							rel="noreferrer"
						>
							<GitHubLogoIcon className="h-6 w-6" />
						</Link>
					</Button>
					<DialogTrigger>
						<Button
							variant="outline"
							className="h-7 w-7 flex items-center"
							size="icon"
						>
							<InfoCircledIcon className="h-6 w-6" />
						</Button>
					</DialogTrigger>
				</div>
				<DialogContent className="sm:w-[750px] w-full max-h-screen overflow-y-scroll sm:py-6 py-12">
					<DialogHeader className="mr-auto">
						<DialogTitle>Clean and Simple Code Sharing</DialogTitle>
					</DialogHeader>
					<p>No ads, no fuss, just code</p>
					<h3 className="font-semibold">API</h3>
					<pre className="bg-secondary overflow-scroll p-2 rounded-md sm:text-sm text-xs sm:text-nowrap text-wrap">
						<code>{`curl --location 'https://www.snippets.so/api/upload' \\
          --header 'Content-Type: application/json' \\
          --data '{
            "content": "console.log(\\"hello world!\\")",
            "name": "hello.ts",
            "lang": "typescript"
            "isPrivate: "true | false",
            "expires": "number of seconds | 0 for no expiration",
            "password": "password to be hashed | "(blank strings for no password)",
          }'`}</code>
					</pre>
					<p>List of supported languages</p>
					<pre className="bg-secondary p-2 rounded-md sm:text-sm text-xs sm:text-nowrap text-wrap">
						<code>GET https://www.snippets.so/api/languages</code>
					</pre>
					<p>Usage</p>
					<pre className="bg-secondary p-2 rounded-md sm:text-sm text-xs sm:text-nowrap text-wrap">
						<code>
							https://snippets.so/snip/{"{"}IpfsHash{"}"}
						</code>
					</pre>

					<h3 className="font-semibold">CLI</h3>
					<pre className="bg-secondary p-2 rounded-md sm:text-sm text-xs sm:text-nowrap text-wrap">
						<code>brew install stevedylandev/snippets-cli/snippets-cli</code>
					</pre>
					<p className="text-sm text-muted-foreground">
						For other installs check out the{" "}
						<a
							href="https://github.com/stevedylandev/snippets-cli"
							className="underline"
							target="_blank"
							rel="noreferrer"
						>
							Github repo
						</a>
					</p>
					<p className="text-sm font-semibold">Usage</p>
					<pre className="bg-secondary p-2 rounded-md sm:text-sm text-xs relative">
						<code>snip hello.ts</code>
					</pre>
					<Separator />
					<p className="text-sm">
						Feedback?{" "}
						<Link className="underline" href="mailto:hello@stevedylan.dev">
							hello@stevedylan.dev
						</Link>
					</p>
					<div className="flex items-center justify-start gap-4 w-full">
						<p className="text-sm">Like what you see?</p>
						<Button asChild variant="outline" size="icon">
							<Link href="https://rainbow.me/stevedylandev.eth" target="_blank">
								<Image
									className="h-8 w-6"
									src="/ethereum.svg"
									width={200}
									height={200}
									alt="bmc-logo"
								/>
							</Link>
						</Button>
						<Button asChild variant="outline" size="icon">
							<Link
								href="https://buymeacoffee.com/stevedylandev"
								target="_blank"
							>
								<Image
									className="h-6 w-4"
									src="/bmc.png"
									width={200}
									height={200}
									alt="bmc-logo"
								/>
							</Link>
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
