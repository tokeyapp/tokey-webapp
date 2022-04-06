import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
	useAddress,
	useMetamask,
	useNFTCollection,
	useSigner,
} from '@thirdweb-dev/react';
import {
	NetworkOrSignerOrProvider,
	NFTCollection,
	NFTContractDeployMetadata,
	ThirdwebSDK,
} from '@thirdweb-dev/sdk';

import { create as ipfsHttpClient } from 'ipfs-http-client';

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

	const ipfsGateway = 'https://ipfs.infura.io:5001/api/v0';
	const ipfsClient = ipfsHttpClient(ipfsGateway);

	const fileTypes = ['JPG', 'PNG', 'GIF'];

	const signer = useSigner();
	const sdk = new ThirdwebSDK(signer);

	/********************************************/
	/*   GET CONNECTED WALLET FROM THIRDWEB
  /********************************************/
	useEffect(() => {
		if (!address) {
			console.log('Connected wallet: none');
			return;
		}
		console.log('Connected wallet: ', address);
		setNftCollectionMetadata({
			...nftCollectionMetadata,
			primary_sale_recipient: address,
		});
	}, [address]);

	/********************************************/
	/*    ORCHESTRATING FULL NFT CREATION PROCESS
  /********************************************/
	const createNFT = () => {
		console.log('creating NFT:', nftMetadata);
		return;
	};

	/********************************************/
	/*    CREATING NFT ON-CHAIN FROM IPFS FQ URL
  /********************************************/
	const createNftOnChain = async (collection) => {
		console.log('Creating NFT in', collection);
		const contract = sdk.getNFTCollection(collection);
		const tx = await contract.mint(nftMetadata);
		console.log('Created NFT in tx:', tx);
	};

	/********************************************/
	/*    UPLOAD NFT + METADATA TO IPFS
  /********************************************/
	const uploadContentFile = async (e) => {
		const file = e.target.files[0];
		try {
			const uploadedFile = await ipfsClient.add(file, {
				progress: (prog) => console.log(`Upload progress: ${prog} bytes`),
			});
			const uploadedFileUrl = `https://ipfs.infura.io/ipfs/${uploadedFile.path}`;
			setFileUrl(uploadedFileUrl);
		} catch (error) {
			console.log('Error uploading file:', error);
		}

		const { name, description, price } = nftMetadata;
		if (!name || !description || !price) {
			return;
		}

		const metadata = JSON.stringify({
			name,
			description,
			image: fileUrl,
		});

		console.log('NFT for creation is:', metadata);
	};

	return (
		<div className={style.container}>
			<div className='flex w-3/5 mx-auto p-4'>
				<form className='w-3/5 text-left'>
					<div>
						<label
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
							htmlFor='NFT file'
						>
							Upload file
						</label>
						<input
							className='block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
							aria-describedby='user_avatar_help'
							id='asset'
							name='asset'
							type='file'
							onChange={uploadContentFile}
						/>
					</div>
					<div className='my-6'>
						<label
							htmlFor='email'
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
							htmlFor='password'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
						>
							Description
						</label>
						<textarea
							id='message'
							rows='4'
							className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							placeholder='Describe your asset...'
							onChange={(e) =>
								setNftMetadata({ ...nftMetadata, description: e.target.value })
							}
						/>
					</div>
					<div className='my-6'>
						<label
							htmlFor='password'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
						>
							Price
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
						onClick={createNFT}
					>
						Create NFT
					</button>
				</form>
				<div className='grid grid-cols-1 gap-4 '>
					<div className='w-full h-0 shadow-lg pb-full rounded-xl ml-20 mt-6 border-2 border-tblue bg-tlightblue text-tblue'>
						Image goes here
					</div>
				</div>
			</div>
		</div>
	);
};

export default Create;
