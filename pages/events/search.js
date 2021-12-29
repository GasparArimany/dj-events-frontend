import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import EventItem from '@/components/EventItem';
import qs from 'qs';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SearchPage({ events }) {
	const router = useRouter();
	return (
		<Layout title='Search Results'>
			<Link href='/events'>Go back</Link>
			<h1>Search results for: {router.query.term}</h1>
			{events.length === 0 && <h3>No events to show</h3>}
			{events.map((event) => (
				<EventItem key={event.id} event={{ ...event.attributes }} />
			))}
		</Layout>
	);
}

export async function getServerSideProps({ query: { term } }) {
	const query = qs.stringify(
		{
			filters: {
				$or: [
					{
						name: {
							$contains: term,
						},
					},
					{
						venue: {
							$contains: term,
						},
					},
					{
						performers: {
							$contains: term,
						},
					},
					{
						description: {
							$contains: term,
						},
					},
				],
			},
		},
		{ encodeValuesOnly: true }
	);
	const res = await fetch(`${API_URL}/events?${query}`);
	const events = await res.json();

	return { props: { events: events.data } };
}
