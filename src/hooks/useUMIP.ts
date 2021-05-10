import { useQuery } from "react-query";
import * as contentful from "contentful";

export default function useUMIP(number?: number) {
  const { data, ...others } = useQuery<UMIP>(
    ["umip", number],
    () => fetchUmip(number!),
    {
      enabled: number != null,
    }
  );

  return { umip: data, ...others };
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
