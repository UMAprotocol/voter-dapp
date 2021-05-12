import { useQuery } from "react-query";
import * as contentful from "contentful";

// only for testing purposes. This UMIP is returned to avoid showing misleading data on anything thats not mainnet.
const testUmip: UMIP = {
  description: `
    # Add UMA as collateral

    This is a fake UMIP only used for testing purposes. 
    If you can see this, it means you are currently connect to a testnet.
    If you wanted to vote on real proposals, please change network and refresh the page (and thank you for voting :))
  `,
  title: "Make UMA an oracle token",
  number: 100,
};

export default function useUMIP(number?: number, chainId = 1) {
  const { data, ...others } = useQuery<UMIP>(
    ["umip", number],
    () => fetchUmip(number!),
    {
      enabled: number != null && chainId === 1,
    }
  );

  return { umip: chainId === 1 ? data : testUmip, ...others };
}

const contenfulSpaceId = process.env.REACT_APP_PUBLIC_CONTENTFUL_SPACE_ID;
const contentfulAccessToken =
  process.env.REACT_APP_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

const contentfulClient = contentful.createClient({
  space: contenfulSpaceId || "",
  accessToken: contentfulAccessToken || "",
});

type UMIP = {
  description: any;
  discourseLink?: string;
  status?: string;
  authors?: string;
  title: string;
  number: number;
};
const fetchUmip = async (number: number) => {
  const ct = await contentfulClient.getEntries<UMIP>({
    content_type: "umip",
    "fields.number": number,
  });
  return ct.items[0].fields;
};
