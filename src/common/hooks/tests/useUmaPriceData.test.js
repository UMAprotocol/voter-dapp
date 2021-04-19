import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import nock from "nock";
import { QueryClient, QueryClientProvider } from "react-query";
import useUmaPriceData from "../useUmaPriceData";

axios.defaults.adapter = require("axios/lib/adapters/http");

const expectation = nock("https://api.coingecko.com")
  .get("/api/v3/coins/uma")
  .reply(200, {
    price: 100,
  });

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
describe("useUmaPriceData hook", () => {
  it("Resolves a promise on mount", async () => {
    const { result, waitFor } = renderHook(() => useUmaPriceData(), {
      wrapper,
    });

    await waitFor(() => result.current.isLoading === false);
    expect(result.current.data.price).toEqual(100);
  });
});
