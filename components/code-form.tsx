"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CodeMirror from "@uiw/react-codemirror";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useRouter } from "next/navigation";
import { defaultCode } from "@/lib/default";
import { CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import type { LanguageName } from "@uiw/codemirror-extensions-langs";
import { languages } from "@/lib/languages";
import { Checkbox } from "./ui/checkbox";
import * as Argon2 from "argon2-browser";

type CodeFormProps = {
	readOnly: boolean;
	content: string;
};

const times = [
	{
		displayName: "No Expiration",
		value: "0",
	},
	{
		displayName: "10 Minutes",
		value: "600",
	},
	{
		displayName: "1 Hour",
		value: "3600",
	},
	{
		displayName: "10 Hours",
		value: "36000",
	},
	{
		displayName: "1 Day",
		value: "86400",
	},
	{
		displayName: "10 Days",
		value: "864000",
	},
];

export function CodeForm({ readOnly, content }: CodeFormProps) {
	const [value, setValue] = useState(defaultCode);
	const [name, setName] = useState("file");
	const [loading, setLoading] = useState(false);
	const [complete, setComplete] = useState(false);
	const [lang, setLang] = useState<LanguageName>("tsx");
	const [terms, setTerms] = useState<boolean>(false);
	const [time, setTime] = useState<string>();
	const [password, setPassword] = useState<string>("");
	const router = useRouter();

	const languageExtension = useMemo(() => {
		const extension = loadLanguage(lang);
		return extension ? [extension] : [];
	}, [lang]);

	const onChange = useCallback((val: string) => {
		console.log("val:", val);
		setValue(val);
	}, []);

	async function submitHandler() {
		try {
			setLoading(true);
			let isPrivate = "true";
			let passwordHash = "";
			if (time === "0") {
				isPrivate = "false";
			}
			if (password !== "") {
				isPrivate = "true";
				const salt = window.crypto.getRandomValues(new Uint8Array(16));
				const result = await Argon2.hash({
					pass: password,
					salt: salt,
					time: 3, // number of iterations
					mem: 4096, // memory usage in KiB
					hashLen: 32, // output size in bytes
					parallelism: 1, // degree of parallelism
				});
				passwordHash = result.encoded;
				console.log("Password hash:", passwordHash); // for debugging
			}
			const body = JSON.stringify({
				content: value,
				name: name,
				lang: lang,
				isPrivate: isPrivate,
				expires: time,
				password: passwordHash,
			});
			const req = await fetch("/api/upload", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: body,
			});
			const res = await req.json();
			setComplete(true);
			router.push(`/snip/${res.IpfsHash}`);
		} catch (error) {
			console.log(error);
			setLoading(false);
			return error;
		}
	}

	function ButtonLoading() {
		return (
			<Button disabled>
				<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
				Please wait
			</Button>
		);
	}
	function ButtonComplete() {
		return (
			<Button disabled className="bg-green-600">
				<CheckIcon className="mr-2 h-4 w-4" />
				Complete!
			</Button>
		);
	}

	return (
		<div className="w-full h-full flex flex-col justify-center items-center gap-4 mb-6">
			<Card className="overflow-hidden">
				<div className="bg-secondary flex justify-between align-start w-full">
					<Input
						placeholder="filename + extension"
						className="w-56 m-2 py-0 h-6 text-xs rounded-md"
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setName(e.target.value)
						}
					/>
					<Select
						onValueChange={(e: LanguageName) => setLang(e)}
						defaultValue="typescript"
					>
						<SelectTrigger className="w-[125px] h-6 m-2 text-xs rounded-md">
							<SelectValue placeholder="language" />
						</SelectTrigger>
						<SelectContent className="text-xs">
							{languages.map((object) => (
								<SelectItem
									key={object.value}
									className="text-xs"
									value={object.value}
								>
									{object.displayName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<CodeMirror
					className="text-md opacity-75 p-2 sm:w-[600px] sm:h-[700px] w-[350px] h-[450px]"
					height="100%"
					width="100%"
					value={value}
					basicSetup={{
						lineNumbers: false,
						foldGutter: false,
					}}
					extensions={languageExtension}
					onChange={onChange}
					theme={githubLight}
					readOnly={readOnly}
				/>
			</Card>
			{loading && !complete && ButtonLoading()}
			{!loading && !complete && (
				<>
					<div className="items-center flex flex-col gap-6">
						<Select onValueChange={(e: string) => setTime(e)}>
							<SelectTrigger className="h-8 m-2 text-xs">
								<SelectValue placeholder="Expiration" />
							</SelectTrigger>
							<SelectContent>
								{times.map((object) => (
									<SelectItem
										className="text-xs"
										key={object.value}
										value={object.value}
									>
										{object.displayName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Input
							type="password"
							placeholder="Password (optional)"
							onChange={(e) => setPassword(e.target.value)}
							className="w-full"
						/>

						<div className="flex space-x-2 items-top">
							<Checkbox
								checked={terms}
								onCheckedChange={() => setTerms(!terms)}
								id="terms1"
							/>
							<div className="grid gap-1.5 leading-none">
								<label
									htmlFor="terms1"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									I acknowledge all snippets are public
								</label>
							</div>
						</div>
					</div>
					<Button disabled={!terms} onClick={submitHandler}>
						Create Snippet
					</Button>
				</>
			)}
			{loading && complete && ButtonComplete()}
		</div>
	);
}
