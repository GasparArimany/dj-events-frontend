import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddEventPage() {
	const [values, setValues] = useState({
		name: '',
		performers: '',
		venue: '',
		address: '',
		date: '',
		time: '',
		description: '',
	});
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const hasEmptyFields = Object.values(values).some((val) => val === '');
		if (hasEmptyFields) {
			toast.error('Please fill in all field');
		}
		const res = await fetch(`${API_URL}/events`, {
			method: 'POST',
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
	return (
		<div>
			<Layout title='Add new event'>
				<Link href='/events'>Go back</Link>
				<h1>Add event</h1>
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
								value={values.date}
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
					<input type='submit' value='Add Event' className='btn' />
				</form>
			</Layout>
		</div>
	);
}
