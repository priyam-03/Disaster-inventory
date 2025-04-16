import dynamic from "next/dynamic";
import { authOptions } from '../../lib/AuthOptions'
import { getServerSession } from 'next-auth'

import { redirect } from 'next/navigation'


// Define a functional React component named `Home`.
export default async function Home() {

	const session = await getServerSession(authOptions)

	if (!session) {
	  redirect('/signin') 
	  // Or wherever your login page is
	}
	const MyMap = dynamic(() => import("../../components/MyMap"), {
		loading: () => <p>A map is loading</p>,
		ssr: false,
	});

	// Render the dynamically imported `MyMap` component.
	return (

		<MyMap />
			
	);
}
