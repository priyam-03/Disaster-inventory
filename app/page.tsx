import dynamic from "next/dynamic";
import { redirect } from 'next/navigation'
import { authOptions } from '../lib/AuthOptions'
import { getServerSession } from 'next-auth'
import LogoutBtn from '@/components/LogoutBtn'
import LocationsLandingPage from "@/components/landing";
// Define a functional React component named `Home`.
export default async function Home() {
	// const session = await getServerSession(authOptions)
	
	//   if (!session) {
	// 	redirect('/signin') 
	// 	// Or wherever your login page is
	//   }
	// const MyMap = dynamic(() => import("../components/NmyMap"), {
	// 	loading: () => <p>A map is loading</p>,
	// 	ssr: false,
	// });

	// Render the dynamically imported `MyMap` component.
	return (

		<LocationsLandingPage />
		// <MyMap />
		// <LogoutBtn />
	);
}
