const envNetwork = process.env.REACT_APP_CURRENT_ENV;

const networks: { [key: string]: string } = {
  test: "1337",
  main: "1",
  kovan: "42",
};

// Determine network based on REACT_APP_CURRENT_ENV variable.
// Default to mainnet.
export default function determineBlockchainNetwork() {
  if (envNetwork) {
    return networks[envNetwork];
  } else {
    return "1";
  }
}
