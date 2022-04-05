import React, { useState } from 'react'
import Head from 'next/head'
import { Container, Pagination } from 'react-bootstrap'
import { MoviesTable } from '../components'
import axios from 'axios'

export async function getStaticProps() {
	try {
		const { data } = await axios.get(`${process.env.APP_DOMAIN}/api/movies/0`)
		return { props: { ...data } }
	} catch (error) {
		console.error(error)
	}

	return {
		props: {
			length: 0,
			movies: []
		},
	}
}

export default function Home({ movies, length }) {
	const [data, setData] = useState(movies)
	const [page, setPage] = useState(0)

	const handlePageChange = async (page) => {
		setPage(page)
		const { data } = await axios.get(`/api/movies/${page}`)
		setData(data.movies)
	}

	return (
		<div>
			<Head>
				<title>S3 project - Movie list</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Container style={{ marginTop: '50px' }}>
				<h1>Welcome to my movie list !</h1>
				<MoviesTable data={data} />

				<Pagination>
					{page > 0 && <Pagination.First onClick={() => handlePageChange(0)} />}
					{page > 0 && <Pagination.Prev onClick={() => handlePageChange(page - 20)} />}
					{page > 0 && <Pagination.Ellipsis />}

					{Array.from({ length: Math.ceil(length / 20) }).map((_, index) => {
						if ((index * 20) >= page - 80 && (index * 20) <= page + 80) {
							return (
								<Pagination.Item
									key={index}
									onClick={() => handlePageChange(index * 20)}
									active={index * 20 === page}
									disabled={index * 20 === page}
								>
									{index + 1}
								</Pagination.Item>
							)
						}
					})}

					{page < length - 20 && <Pagination.Ellipsis />}
					{page < length - 20 && <Pagination.Next onClick={() => handlePageChange(page + 20)} />}
					{page < length - 20 && <Pagination.Last onClick={() => handlePageChange(length - 20)} />}
				</Pagination>
			</Container>
		</div>
	)
}
