import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import EventItem from '@/components/EventItem';
import qs from 'qs';

export default function EventsPage({ events }) {
	return (
		<Layout>
			<h1>Events</h1>
			{events.length === 0 && <h3>No events to show</h3>}
			{events.map((event) => (
				<EventItem key={event.id} event={{ ...event.attributes }} />
			))}
		</Layout>
	);
}

export async function getStaticProps() {
	const query = qs.stringify(
		{
			sort: ['date:asc'],
			populate: '*',
		},
		{ encodeValuesOnly: true }
	);
	const res = await fetch(`${API_URL}/events?${query}`);
	const events = await res.json();

	return { props: { events: events.data }, revalidate: 1 };
}
