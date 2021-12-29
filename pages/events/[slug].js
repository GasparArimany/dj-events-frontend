import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import qs from 'qs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function EventPage({ event }) {
	const router = useRouter();
	const deleteEvent = async (e) => {
		if (confirm('Are you sure?')) {
			const res = await fetch(`${API_URL}/events/${event.id}`, {
				method: 'DELETE',
			});
			const result = await res.json();
			if (!res.ok) {
				toast.error(result.message);
			} else {
				router.push('/events');
			}
		}
	};
	const date = new Date(event.date).toLocaleDateString('es-ES');
	return (
		<Layout>
			<div className={styles.event}>
				<div className={styles.controls}>
					<Link href={`/events/edit/${event.id}`}>
						<a>
							<FaPencilAlt /> Edit Event
						</a>
					</Link>
					<a href='#' className={styles.delete} onClick={deleteEvent}>
						<FaTimes /> Delete Event
					</a>
				</div>
				<span>
					{date} at {event.time}
				</span>
				<h1>{event.name}</h1>
				{event.image.data && (
					<div className={styles.image}>
						<Image
							alt='event image'
							src={event.image.data.attributes.formats.large.url}
							width={960}
							height={600}
						/>
					</div>
				)}
				<h3>Performers:</h3>
				<p>{event.performers}</p>
				<h3>Description:</h3>
				<p>{event.description}</p>
				<h3>Venue: {event.venue}</h3>
				<p>{event.address}</p>
				<Link href='/events'>
					<a className='styles.back'>{'<'} Go Back</a>
				</Link>
			</div>
		</Layout>
	);
}

export async function getStaticPaths() {
	const query = qs.stringify(
		{
			sort: ['date:asc'],
			populate: '*',
		},
		{ encodeValuesOnly: true }
	);
	const res = await fetch(`${API_URL}/events?${query}`);
	const events = await res.json();
	const paths = events.data.map((event) => ({
		params: { slug: event.attributes.slug },
	}));

	return {
		paths,
		fallback: false,
	};
}
export async function getStaticProps({ params: { slug } }) {
	const query = qs.stringify(
		{
			filters: {
				slug: {
					$eq: slug,
				},
			},
			populate: '*',
		},
		{ encodeValuesOnly: true }
	);
	const res = await fetch(`${API_URL}/events?${query}`);
	const events = await res.json();
	return {
		props: { event: { id: events.data[0].id, ...events.data[0].attributes } },
		revalidate: 1,
	};
}
