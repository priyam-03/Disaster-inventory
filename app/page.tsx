import dynamic from "next/dynamic";

// Define a functional React component named `Home`.
export default function Home() {
	const MyMap = dynamic(() => import("../components/MyMap"), {
		loading: () => <p>A map is loading</p>,
		ssr: false,
	});

	// Render the dynamically imported `MyMap` component.
	return (

		<MyMap />	
	);
}
