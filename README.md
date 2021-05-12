# UMA Voter dApp

## Get Started

Yarn was used for package management. Install yarn and run

`yarn`

To install packages.

You will also need to add a .env file and define:\
REACT_APP_PUBLIC_INFURA_ID \
REACT_APP_PUBLIC_ONBOARD_API_KEY \
REACT_APP_PUBLIC_PORTIS_API_KEY
REACT_APP_PUBLIC_CONTENTFUL_SPACE_ID
REACT_APP_PUBLIC_CONTENTFUL_ACCESS_TOKEN

## Testing Voter dApp locally

In order to test the app with Ganache, you must clone [UMA Protocal Core](https://github.com/UMAprotocol/protocol)

In a separate terminal, go into the packages/core directory and run:

`yarn build`

You may also need to migrate.

`npx truffle migrate --network=test`

In this app, run:

`yarn link "@uma/core"`

This will link the built contracts and they will be referencable.

You will then need to run this script in another window [Run Voting Tests](https://github.com/UMAprotocol/protocol/blob/master/packages/voter-dapp/run_tests.sh)\
This will walk you through the testing process.

Once run_tests.sh is running, make sure to run ganache-cli in another terminal with the following command:

`ganache-cli -p 9545 -e 10000000000 -l 9000000 -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat" --chainId 1337 --networkId 1337`

This will run a local ganache server.

To actually integrate and do blockchain calls to ganache, add the network in your MM network tab.

You will also need to add to your local .env file:\
// Set this REACT_APP_CURRENT_ENV to either: test, main, kovan. If not defined, defaults to main in the app.
REACT_APP_CURRENT_ENV = <"test" | "main" | "kovan">

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
