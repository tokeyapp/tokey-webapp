import React from 'react';
import Router from 'next/router';

const index = ({ data = {} }) => {
  console.log('AssetCard - data:', data);
  return (
    <div className="hover:-translate-y-[2px] hover:ease-[ all 0.1s ease 0s] hover:shadow-[0px_0px_8px_0px_rgb(4,17,29,25%)] group relative border-solid border-[1px] border-rgb(229, 232, 235) rounded-[10px] w-full">
      <div className="bg-gray-200 rounded-t-[10px] aspect-w-1 aspect-h-1 overflow-hidden lg:aspect-none ">
        <img className="w-full" src={data?.asset?.image} />
      </div>
      <div className="p-[12px] flex justify-between">
        <div
          className="cursor-pointer"
          onClick={() => {
            Router.push({
              pathname: `/collections/${data?.assetContractAddress}`,
            });
          }}
        >
          {
            <h3 className="text-sm text-tlightblue hover:text-tblue font-semibold">
              {data?.collectionName}
            </h3>
          }
          <p className="mt-1 text-left text-lg text-gray-500">
            {data?.asset?.name || ''}
          </p>
        </div>
        <p className="text-sm font-medium text-gray-600">
          $ {data?.buyoutCurrencyValuePerToken?.displayValue}
        </p>
      </div>
    </div>
  );
};

export default index;
