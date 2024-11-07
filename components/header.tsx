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
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";
import Image from "next/image";

export function Header() {
	return (
		<div className="flex items-center justify-between mt-4 w-[350px] sm:w-[600px] mb-4">
			<Dialog>
				<Link className="font-commitMono text-2xl font-bold" href="/">
					Snippets.so
				</Link>
				<DialogTrigger>
					<Button
						variant="outline"
						className="h-7 w-7 flex items-center"
						size="icon"
					>
						<InfoCircledIcon className="text-muted-foreground h-6 w-6" />
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:w-[750px] w-full max-h-screen">
					<DialogHeader className="mr-auto">
						<DialogTitle>Clean and Simple Code Sharing</DialogTitle>
					</DialogHeader>
					<p>No ads, no fuss, just code</p>
					<h3 className="font-semibold">API</h3>
					<pre className="bg-secondary p-2 rounded-md sm:text-sm text-xs sm:text-nowrap text-wrap">
						<code>{`curl --location 'https://www.snippets.so/api/upload' \\
          --header 'Content-Type: application/json' \\
          --data '{
            "content": "console.log(\\"hello world!\\")",
            "name": "hello.ts",
            "lang": "typescript"
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
