# Ethereum Web Wallet Challenge

Welcome to my personal challenge project: a web-based Ethereum wallet capable of sending raw transactions without relying on external libraries. This project leverages the power of React, Vite, and several cutting-edge technologies to create a minimalistic yet fully functional Ethereum wallet. Dive into the world of blockchain development with me as we explore the capabilities of raw JSON RPC and the security of BIP39 mnemonic seeds.

## Features

- **Raw JSON RPC Integration**: Directly communicate with Ethereum nodes using raw JSON RPC calls, bypassing the need for external web3 libraries.
- **Network Selection:** Sepolia testnet, Ethereum Mainnet and Polygon Mainnet.
- **BIP39 Mnemonic Support**: Securely generate and manage your Ethereum keys using BIP39 style master seeds with mnemonics, ensuring your wallet's security is top-notch.
- **Tanstack's useQuery**: Leverage Tanstack's useQuery for efficient data fetching and state management, making the app responsive and fast.
- **Tailwind CSS**: Styled with Tailwind for a sleek and modern UI that's both responsive and customizable.
- **Modern React**: Built with the latest React features to create a dynamic and efficient user experience.
- **Vite**: Enjoy lightning-fast development with Vite's Hot Module Replacement (HMR), optimizing your development experience.

## Prerequisites

To run this project, you'll need to have the following environment variable set:

- `VITE_INFURA_PROJECT_ID`: Your Infura project ID to connect to Ethereum networks.

Also ensure you have Node.js installed to use npm commands.

## Getting Started

1. Clone the repository to your local machine.
2. Navigate to the project directory and install dependencies with `npm install`.
3. Set the `VITE_INFURA_PROJECT_ID` environment variable with your Infura Project ID.
4. Run the project using `npm run dev`, and navigate to `http://localhost:3000` to view the app.

## Custom ESLint Configuration

To ensure code quality and consistency, we've tailored the ESLint configuration for this project. Follow the guidelines below to further customize ESLint for your development needs:

- Update the `parserOptions` in the ESLint configuration to include your project settings.
- Consider using `plugin:@typescript-eslint/recommended-type-checked` for type-aware linting rules.
- Install `eslint-plugin-react` for React-specific linting rules and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to your configuration for optimal React coding practices.

## Contributing

Your contributions are welcome! Whether it's bug fixes, feature additions, or improvements to the documentation, feel free to fork this repository and submit a pull request.

## License

This project is open-sourced under the MIT License. See the LICENSE file for more details.

---

Embark on this journey with me as we build a secure, efficient, and user-friendly Ethereum web wallet. Let's explore the possibilities together!
