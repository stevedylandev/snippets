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
import { languages } from "@/lib/languages";
import { Checkbox } from "./ui/checkbox";

export function CodeForm({ readOnly, content }: any) {
	const [value, setValue] = useState(defaultCode);
	const [name, setName] = useState("file");
	const [loading, setLoading] = useState(false);
	const [complete, setComplete] = useState(false);
	const [lang, setLang]: any = useState("tsx");
	const [terms, setTerms]: any = useState(false);
	const router = useRouter();

	const languageExtension = useMemo(() => {
		const extension = loadLanguage(lang);
		return extension ? [extension] : [];
	}, [lang]);

	const onChange = useCallback((val: any, viewUpdate: any) => {
		console.log("val:", val);
		setValue(val);
	}, []);

	async function submitHandler() {
		try {
			setLoading(true);
			const body = JSON.stringify({
				content: value,
				name: name,
				lang: lang,
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
		<div className="w-full h-full flex flex-col justify-center items-center gap-4">
			<Card className="overflow-hidden">
				<div className="bg-secondary flex justify-between align-start w-full">
					<Input
						placeholder="filename + extension"
						className="w-56 m-2 py-0 h-6 text-xs rounded-md"
						onChange={(e: any) => setName(e.target.value)}
					/>
					<Select onValueChange={(e) => setLang(e)} defaultValue="typescript">
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
					<div className="items-top flex space-x-2">
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
					<Button disabled={!terms ? true : false} onClick={submitHandler}>
						Create Snippet
					</Button>
				</>
			)}
			{loading && complete && ButtonComplete()}
		</div>
	);
}
