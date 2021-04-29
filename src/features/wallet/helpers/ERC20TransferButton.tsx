// Note: This only exists for testing. Renders a button to transfer UMA for testing.
import { FC } from "react";
import Button from "common/components/button";
import { ethers } from "ethers";
import createERC20ContractInstance from "common/utils/web3/createERC20ContractInstance";

interface Props {
  network: ethers.providers.Network | null;
  signer: ethers.Signer | null;
  votingAddress: string | null;
  hotAddress: string | null;
}
const ERC20TransferButton: FC<Props> = ({ network, signer, votingAddress }) => {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        if (network && signer && votingAddress) {
          const erc20 = createERC20ContractInstance(
            signer,
            network.chainId.toString()
          );
          erc20.functions
            .transfer(
              votingAddress,
              // 50k tokens, adjust as needed
              "50000000000000000000000"
            )
            .then((res) => {
              console.log("successful transfer", res);
            })
            .catch((err) => {
              console.log("err in transfer", err);
            });
        }
      }}
    >
      ERC20
    </Button>
  );
};

export default ERC20TransferButton;
