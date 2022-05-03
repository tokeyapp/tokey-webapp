import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAddress, useSigner, useNFTCollection } from '@thirdweb-dev/react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

import toast, { Toaster } from 'react-hot-toast';

import { AlchemyProvider } from '@ethersproject/providers';

import { create as ipfsHttpClient } from 'ipfs-http-client';
import nft from './nft';

const style = {
	container: 'flex justify-center text-center bg-white pt-20 pb-40',
	text: 'inline-block align-middle text-5xl',
};

const Create = () => {
	const address = useAddress();
	const [fileUrl, setFileUrl] = useState(null);
	const [nftMetadata, setNftMetadata] = useState({
		name: '',
		description: '',
		image: '',
	});
	const router = useRouter();

	const apiKey = `RxnA6DDDU0-ukw5KwC57KafClF9si1cB`;
	const provider = useMemo(() => {
		return new AlchemyProvider('maticmum', apiKey);
	}, [apiKey]);

	console.log('Provider URL:', provider.connection.url);

	const ipfsGateway = 'https://ipfs.infura.io:5001/api/v0';
	const ipfsClient = ipfsHttpClient(ipfsGateway);

	const signer = useSigner();
	const sdk = new ThirdwebSDK(signer);

	const ipfsLoader = ({ src }) => {
		return `${src}`;
	};

	/********************************************/
	/*   GET CONNECTED WALLET FROM THIRDWEB
  /********************************************/
	useEffect(() => {
		if (!address) {
			console.log('Connected wallet: none');
			return;
		}
		console.log('Connected wallet: ', address);
	}, [address]);

	/********************************************/
	/*    ORCHESTRATING FULL NFT CREATION PROCESS
  /********************************************/
	const createNft = async (event) => {
		event.preventDefault();
		await uploadNFTandMetadata();

		// Test to see if IPFS upload was successful
		if (nftMetadata.name !== '') {
			console.log('Metadata complete. Creating NFT...');
			await createNftOnChain('0x4b94B8077da9db887a37a8814dAc0CFAD22B5A99');
			return;
		}

		console.log('Error: no metadata');
		router.push('/');
	};

	/********************************************/
	/*    CREATING NFT ON-CHAIN FROM IPFS FQ URL
  /********************************************/
	const createNftOnChain = async (collection) => {
		console.log('Creating NFT in collection contract', collection);
		const contract = sdk.getNFTCollection(collection);
		console.log('Collection contract object is', contract);
		const tx = await contract.mintToSelf(nftMetadata);
		console.log('Created NFT in tx:', tx);
		toast.success('NFT created!', { duration: 4000 });
	};

	/********************************************/
	/*    UPLOAD NFT + METADATA TO IPFS
  /********************************************/
	const uploadContentFile = async (e) => {
		const file = e.target.files[0];
		console.log('Trying to upload', file);
		try {
			const uploadedFile = await ipfsClient.add(file, {
				progress: (prog) => console.log(`Upload progress: ${prog} bytes`),
			});
			const uploadedFileUrl = `https://ipfs.infura.io/ipfs/${uploadedFile.path}`;
			console.log('Uploaded file to IPFS at', uploadedFileUrl);
			setFileUrl(uploadedFileUrl);
			setNftMetadata({ ...nftMetadata, image: fileUrl });
		} catch (error) {
			console.log('Error uploading image file:', error);
		}
	};

	const uploadNFTandMetadata = async () => {
		const { name, description, price } = nftMetadata;
		if (!name || !description || !price) {
			console.log('Metadata not complete. Aborting IPFS creation');
			console.log('Metadata is:', nftMetadata);
			return;
		}

		const metadata = JSON.stringify({
			name,
			description,
			image: fileUrl,
		});
		console.log('NFT for creation is:', metadata);
		try {
			const added = await ipfsClient.add(metadata);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;
			console.log('Fully-Qualified NFT URL is', url);
		} catch (error) {
			console.log('Error uploading NFT + Metadata:', error);
		}
	};

	// This fires each time we change fileURL to get the metadata update in a
	// different closure
	useEffect(() => {
		setNftMetadata({ ...nftMetadata, image: fileUrl });
	}, [fileUrl]);

	return (
		<div className={style.container}>
			<Toaster position='bottom-right' reverseOrder={false} />
			{!address ? (
				<div className='py-96'>Connect a wallet to get started</div>
			) : (
				<div className='flex w-3/5 mx-auto p-4'>
					<form className='w-3/5 text-left' onSubmit={createNft}>
						<div>
							<label
								className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
								htmlFor='image'
							>
								Upload file
							</label>
							<input
								className='block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
								aria-describedby='user_avatar_help'
								id='image'
								name='image'
								type='file'
								onChange={uploadContentFile}
								required
							/>
						</div>
						<div className='my-6'>
							<label
								htmlFor='name'
								className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
							>
								Name
							</label>
							<input
								type='name'
								id='name'
								className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-tblue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-tblue dark:shadow-sm-light'
								placeholder='asset name'
								onChange={(e) =>
									setNftMetadata({ ...nftMetadata, name: e.target.value })
								}
								required
							/>
						</div>
						<div className='my-6'>
							<label
								htmlFor='description'
								className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
							>
								Description
							</label>
							<textarea
								id='description'
								rows='4'
								className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
								placeholder='Describe your asset...'
								required
								onChange={(e) =>
									setNftMetadata({
										...nftMetadata,
										description: e.target.value,
									})
								}
							/>
						</div>
						<div className='my-6'>
							<label
								htmlFor='price'
								className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
							>
								Price
							</label>
							<input
								type='number'
								id='price'
								className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-tblue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-tblue dark:shadow-sm-light'
								placeholder='price'
								required
								onChange={(e) =>
									setNftMetadata({ ...nftMetadata, price: e.target.value })
								}
							/>
						</div>

						{/* <div className='my-6'>
					<label
						htmlFor='email'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
					>
						Collection Name
					</label>
					<input
						type='collectionName'
						id='collectionName'
						className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-tblue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-tblue dark:shadow-sm-light'
						placeholder='asset name'
						onChange={(e) =>
							setNftCollectionMetadata({ ...nftMetadata, name: e.target.value })
						}
						required
					/>
				</div>
				<div className='my-6'>
					<label
						htmlFor='password'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
					>
						Collection Description
					</label>
					<textarea
						id='message'
						rows='4'
						className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						placeholder='Describe your collection...'
						onChange={(e) =>
							setNftCollectionMetadata({
								...nftMetadata,
								description: e.target.value,
							})
						}
					/>
				</div> */}

						<div className='flex items-start mb-6'>
							<div className='flex items-center h-5'>
								<input
									id='terms'
									aria-describedby='terms'
									type='checkbox'
									className='w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800'
									required
								/>
							</div>
							<div className='ml-3 text-sm'>
								<label
									htmlFor='terms'
									className='font-medium text-gray-900 dark:text-gray-300'
								>
									I agree with the{' '}
									<a
										href='#'
										className='text-tred hover:text-tpink dark:text-blue-500'
									>
										terms and conditions
									</a>
								</label>
							</div>
						</div>
						<button
							type='submit'
							className='text-white bg-tred hover:bg-tpink focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						>
							Create NFT
						</button>
					</form>
					{!fileUrl ? (
						<div className='ml-20 w-3/5'>
							<div className='w-full h-full shadow-lg pb-full rounded-xl border-2 border-tblue bg-tlightblue text-tblue'>
								Image goes here
							</div>
						</div>
					) : (
						<div className='pl-20 object-contain'>
							<Image
								alt={nftMetadata.name}
								src={fileUrl}
								unoptimized
								width={500}
								height={500}
							/>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Create;
