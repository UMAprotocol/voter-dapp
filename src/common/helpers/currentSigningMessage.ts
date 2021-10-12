// Note: this will be used once we sign more rarely, instead of once per round.
// ATM, we want to keep the current and old voter dapp aligned.
export default function currentSigningMessage(currentRound: number) {
  /*
    Whenever we change the signing message, we should wait until the next round.
    Determine current round, then create a conditional such that if we change the message in the middle of the round, 
    it will only apply to the next, to prevent any bugs in revealing.
    There shouldn't be many reasons for us to change this, this is just to prevent any bugs in the commit -> reveal in a given round.
  */
  if (currentRound > SIGNING_MESSAGE_ONE_ROUND_CREATED) {
    return SIGNING_MESSAGE_ONE;
  }

  // Default return
  return SIGNING_MESSAGE_ONE;
}

const SIGNING_MESSAGE_ONE = "Login to UMA Voter dApp - 0";
const SIGNING_MESSAGE_ONE_ROUND_CREATED = 0;
