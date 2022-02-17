import React from 'react';

const style = {
	footer: `bg-[#034078] w-screen px-[1.2rem] py-[0.8rem] pt-6 flex text-white relative justify-center flex-wrap items-center`,
	form: `ml-[0.8rem] grid md:grid-cols-3 gird-cols-1 gap-4 flex justify-center items-center text-white`,
	formCTA: `font-bold`,
	formInput: `form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none`,
	formButton: `inline-block px-6 py-2 border-2 border-white text-white font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out`,
	button: `inline-block relative font-semibold px-12 py-2 bg-[#363840] rounded mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
};

const NewsletterSignup = () => {
	return (
		<div className={style.footer}>
			<div className={style.form}>
				<div className={style.formCTA}>Sign up for our Newsletter</div>
				<div>
					<input className={style.formInput} placeholder='Your email address' />
				</div>
				<div>
					<button className={style.button} type='submit'>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default NewsletterSignup;