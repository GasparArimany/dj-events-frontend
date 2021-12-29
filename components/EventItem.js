import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/EventItem.module.css';

export default function EventItem({ event }) {
	const date = new Date(event.date).toLocaleDateString('es-ES');
	return (
		<div className={styles.event}>
			<div className={styles.img}>
				<Image
					alt='event image'
					width={170}
					height={100}
					src={
						event.image
							? event.image.data.attributes.formats.thumbnail.url
							: '/images/event-default.png'
					}
				/>
			</div>
			<div className={styles.info}>
				<span>
					{date} at {event.time}
				</span>
				<h3>{event.name}</h3>
			</div>
			<div className={styles.link}>
				<Link href={`events/${event.slug}`}>
					<a className='btn'>Details</a>
				</Link>
			</div>
		</div>
	);
}
