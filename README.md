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

In order to test this dApp, you must clone [UMA Protocol Core](https://github.com/UMAprotocol/protocol).

In a separate terminal, navigate to the root directory of the `protocol` repository.

Follow the instructions in the root directory README for installing the packages with `yarn`.

Add the localhost:9545 network to your MetaMask with the following details:

```
Network Name - Localhost 9545
New RPC URL - http://localhost:9545
Chain ID - 31337
Currency Symbol - ETH
```

**You will also need to add update your local .env file:**

Set the environment variable `REACT_APP_CURRENT_ENV` to either `test`, `main`, or `kovan`. If not defined, defaults to `main` in the app.
`REACT_APP_CURRENT_ENV = <"test" | "main" | "kovan">`

Once all the above is done, navigate to the `packages/scripts` directory and follow the [instructions in the readme](https://github.com/UMAprotocol/protocol/tree/master/packages/scripts#testing-the-voter-dapp) for testing this dApp.

--------------------------------------------------

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
