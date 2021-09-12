import { ParsedAccount } from '../../../metaplex-oyster-common/contexts/accounts';
import { Metadata } from '../../../metaplex-oyster-common/actions/metadata';
import { Store, WhitelistedCreator } from '../../models/metaplex';

export const isMetadataPartOfStore = (
  m: ParsedAccount<Metadata>,
  store: ParsedAccount<Store> | null,
  whitelistedCreatorsByCreator: Record<
    string,
    ParsedAccount<WhitelistedCreator>
  >,
  useAll: boolean,
) => {
  if (useAll) {
    return true;
  }
  if (!m?.info?.data?.creators || !store?.info) {
    return false;
  }

  return m.info.data.creators.some(
    c =>
      c.verified &&
      (store.info.public ||
        whitelistedCreatorsByCreator[c.address]?.info?.activated),
  );
};
