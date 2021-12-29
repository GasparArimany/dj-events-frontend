import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';
import Modal from '@/components/Modal';
import ImageUpload from '@/components/ImageUpload';

export default function EditEventPage({ event }) {
	const [values, setValues] = useState({
		name: event.name,
		performers: event.performers,
		venue: event.venue,
		address: event.address,
		date: event.date,
		time: event.time,
		description: event.description,
	});
	const [imgPreview, setImgPreview] = useState(
		event.image.data ? event.image.data.attributes.formats.thumbnail.url : null
	);

	const [showModal, setShowModal] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const hasEmptyFields = Object.values(values).some((val) => val === '');
		if (hasEmptyFields) {
			toast.error('Please fill in all field');
		}
		const res = await fetch(`${API_URL}/events/${event.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ data: { ...values } }),
		});
		if (!res.ok) {
			toast.error('something went wrong');
		} else {
			const result = await res.json();
			router.push(`/events/${result.data.attributes.slug}`);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({ ...values, [name]: value });
	};

	const imageUploaded = async () => {
		const res = await fetch(`${API_URL}/events/${event.id}?populate=*`);
		const result = await res.json();
		setImgPreview(
			result.data.attributes.image.data.attributes.formats.thumbnail.url
		);
		setShowModal(false);
	};

	return (
		<div>
			<Layout title='Add new event'>
				<Link href='/events'>Go back</Link>
				<h1>Edit event</h1>
				<form className={styles.form} onSubmit={handleSubmit}>
					<div className={styles.grid}>
						<div>
							<label htmlFor='name'>Event Name</label>
							<input
								type='text'
								id='name'
								name='name'
								value={values.name}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor='performers'>Performers</label>
							<input
								type='text'
								id='performers'
								name='performers'
								value={values.performers}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor='venue'>Venue</label>
							<input
								type='text'
								id='venue'
								name='venue'
								value={values.venue}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor='address'>Address</label>
							<input
								type='text'
								id='address'
								name='address'
								value={values.address}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor='date'>Date</label>
							<input
								type='date'
								id='date'
								name='date'
								value={moment(values.date).format('yyyy-MM-DD')}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label htmlFor='time'>Time</label>
							<input
								type='text'
								id='time'
								name='time'
								value={values.time}
								onChange={handleInputChange}
							/>
						</div>
					</div>
					<div>
						<label htmlFor='description'>Description</label>
						<textarea
							type='text'
							id='description'
							name='description'
							value={values.description}
							onChange={handleInputChange}
						></textarea>
					</div>
					<input type='submit' value='Update Event' className='btn' />
				</form>
				<h2>Event Image</h2>
				{imgPreview ? (
					<Image
						alt='event image preview'
						src={imgPreview}
						height={100}
						width={170}
					/>
				) : (
					<div>
						<p>No image uploaded</p>
					</div>
				)}

				<div>
					<button onClick={() => setShowModal(true)} className='btn-secondary'>
						<FaImage /> Set Image
					</button>
				</div>
				<Modal show={showModal} onClose={() => setShowModal(false)}>
					<ImageUpload eventId={event.id} imageUploaded={imageUploaded} />
				</Modal>
			</Layout>
		</div>
	);
}

export async function getServerSideProps({ params: { id } }) {
	const response = await fetch(`${API_URL}/events/${id}?populate=*`);
	const result = await response.json();
	return {
		props: {
			event: { id: result.data.id, ...result.data.attributes },
		},
	};
}
