/* eslint-disable */ 
import * as anchor from "@project-serum/anchor";


import { MintLayout, TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { decodeMetadata, getMetadata, MAX_CREATOR_LEN, MAX_NAME_LENGTH, MAX_SYMBOL_LENGTH, MAX_URI_LENGTH } from '../lib/metaplex-oyster-common/actions/metadata';
import { METAPLEX_ID, StringPublicKey } from '../lib/metaplex-oyster-common/utils/ids'
import { getProgramAccounts, loadAccounts, metadataByMintUpdater } from "../lib/metaplex-web-utils/contexts/meta/loadAccounts";


import { ENDPOINTS } from '../lib/metaplex-oyster-common/contexts/connection';
import { METADATA_PROGRAM_ID } from '../lib/metaplex-oyster-common';
import { MAX_WHITELISTED_CREATOR_SIZE } from "../lib/metaplex-web-utils/models/metaplex";
import { processMetaplexAccounts } from "../lib/metaplex-web-utils/contexts/meta/processMetaplexAccounts";
import { AccountAndPubkey } from "../lib/metaplex-web-utils/contexts/meta/types";
import { processMetaData } from "../lib/metaplex-web-utils/contexts/meta/processMetaData";

export const CANDY_MACHINE_PROGRAM = new anchor.web3.PublicKey(
    "cndyAnrLdpjq1Ssp1z8xxDsB8dxe7u4HL5Nxi2K5WXZ"
);

const mainnetBeta = ENDPOINTS[0].endpoint;
//const devnet = ENDPOINTS[ENDPOINTS.length - 1].endpoint;

const PROD_NFT_EXAMPLE = "4itgFt6tSotypyVAaUkLJzpGQ5KXsJNhwpKBANMv49mf";
const MINT_AUTH = "4tvX1q3WDwPPXQVmoDAfF4xbfqnns859LBZd1RDnpmP3";

//const prod = new anchor.web3.PublicKey(PROD_NFT_EXAMPLE);

const connection = new anchor.web3.Connection(mainnetBeta);

enum RPC {
    GetBalance = 'getBalance',
    GetProgramAccounts = 'getProgramAccounts'
}

async function rpc(call: RPC, data: any[])  {
    const args = connection._buildArgs(data, 'recent', 'base64');
    const unsafeRes = await (connection as any)._rpcRequest(
        call,
        args,
    );
    return unsafeRes;
}

const ADDRESSES_OF_INTEREST = [
  PROD_NFT_EXAMPLE,
  MINT_AUTH
];

export async function loadMetadata() {
 
  const metaplexIDFilter = {
    filters: [
      {
        dataSize: MAX_WHITELISTED_CREATOR_SIZE,
      },
    ],
  };

  const accounts = await getProgramAccounts(connection, METAPLEX_ID);
  var seenOne = false;
  var latestKV;
  for(const account of accounts) {
    if (seenOne) break;
    processMetaplexAccounts(account,
      (prop, key, value) => {
        latestKV = {k: key, v: JSON.stringify(value)};
        if (!seenOne) {
          if (prop === 'whitelistedCreatorsByCreator') {
            seenOne = true;
            console.log("see whitelisted creator");
            console.log(key);
            console.log(value);
          }
        }
      },
      true
    )
  }

  console.log("getting the metadata accounts now");
  const metadataAccounts = await getProgramAccounts(connection, METADATA_PROGRAM_ID,
  {
    filters: [
      {
          memcmp: {
              offset:
              1 + // key
              32, // update auth
              bytes: MINT_AUTH,
          }
      }
    ]
  });
  for (const metadata of metadataAccounts) {
    console.log("found one!!!!!");
  }

  // Try filtering by the mint authority
  /*
  {
    filters: [
      {
          memcmp: {
              offset:
              1 + // key
              32, // update auth
              bytes: MINT_AUTH,
          }
      }
    ]
  }
  */

  console.log("done");

  return {lkv: latestKV};
};
