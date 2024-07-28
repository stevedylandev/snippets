import Link from "next/link";

export function Footer() {
	return (
		<div className="flex flex-col justify-content items-center text-sm my-12">
			<p>Powered by</p>
			<div className="flex gap-4 items-center">
				<Link href="https://vercel.com" target="_blank">
					<svg
						className="w-6 h-6"
						width="1155"
						height="1000"
						viewBox="0 0 1155 1000"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M577.344 0L1154.69 1000H0L577.344 0Z" fill="black" />
					</svg>
				</Link>
				+
				<Link href="https://pinata.cloud" target="_blank">
					<img className="h-12" src="/pinata.png" alt="pinata" />
				</Link>
			</div>
			<p className="pt-1">
				Built by{" "}
				<Link
					className="font-bold underline"
					href="https://stevedylan.dev"
					target="_blank"
				>
					Steve
				</Link>
			</p>
		</div>
	);
}
