import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import EventItem from '@/components/EventItem';
import Link from 'next/link';
import qs from 'qs';

export default function HomePage({ events }) {
	return (
		<Layout>
			<h1>Upcoming events</h1>
			{events.length === 0 && <h3>No events to show</h3>}
			{events.map((event) => (
				<EventItem key={event.id} event={{ ...event.attributes }} />
			))}
			{events.length > 0 && (
				<Link href='/events'>
					<a className='btn-secondary'>View All Events</a>
				</Link>
			)}
		</Layout>
	);
}

export async function getStaticProps() {
	const query = qs.stringify(
		{
			sort: ['date:asc'],
			pagination: {
				limit: 3,
			},
			populate: '*',
		},
		{ encodeValuesOnly: true }
	);
	console.log(query);
	const res = await fetch(`${API_URL}/events?${query}`);
	const events = await res.json();

	return { props: { events: events.data }, revalidate: 1 };
}
