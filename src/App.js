import React, { useEffect, useState } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import { ethers } from "ethers";
import myEpicNft from "./utils/MyEpicNFT.json";

const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x5626b4Aa99bc0A4429dcD1aA6E0bb34E103aF7F4";
const OPENSEA_LINK = `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalNFTsMinted, setTotalNFTsMinted] = useState(0);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Certifique-se que você tem metamask instalado!")
      return;
    } else {
      console.log("Temos o objeto ethereum!", ethereum)
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);

      try {
        if (await verifyChainId(ethereum)) {
          setCurrentAccount(account);
          setupEventListener();
        }

      } catch (e) {
        console.log(e);
      }
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Baixe o Metamask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Conectado", accounts[0]);

      if (await verifyChainId(ethereum)) {
        setCurrentAccount(accounts[0]);
        setupEventListener();
      }

    } catch (error) {
      console.log(error);
    }
  };

  const verifyChainId = async (ethereum) => {
    let chainId = await ethereum.request({ method: 'eth_chainId' });
    console.log("Conectado à rede " + chainId);
    // String, hex code of the chainId of the Rinkebey test network
    const rinkebyChainId = "0x4";
    if (chainId !== rinkebyChainId) {
      const msg = "Você não está conectado a rede Rinkeby de teste! Desconecte através da sua carteira.";
      alert(msg);
      console.log(msg);
      return false;
    }
    return true;
  }

  // Setup do listener.
  const setupEventListener = async () => {

    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        getTotalNFTsMintedSoFar();

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setTotalNFTsMinted(tokenId.toNumber() + 1);

          const msg = `Olá pessoal! Já cunhamos seu NFT. Pode ser que esteja branco agora. Demora no máximo 10 minutos para aparecer no OpenSea. Aqui está o link: ${OPENSEA_LINK}/${tokenId.toNumber()}`;
          console.log(msg);
          alert(msg);
        })

        console.log("Setup event listener!")
      } else {
        console.log("Objeto ethereum não existe!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        console.log("Vai abrir a carteira agora para pagar o gás...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        console.log("Cunhando...espere por favor.");
        await nftTxn.wait();
        console.log(
          `Cunhado, veja a transação: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Objeto ethereum não existe!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Métodos para Renderizar
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Conectar Carteira
    </button>
  );

  const getTotalNFTsMintedSoFar = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer)

        const totalNFTsMinted = await connectedContract.getTotalNFTsMintedSoFar();
        setTotalNFTsMinted(totalNFTsMinted.toNumber());
      } else {
        console.log("Objeto ethereum não existe!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção NFT</p>
          <p className="sub-text">
            Únicas. Lindas. Descubra a sua NFT hoje.
          </p>
          <p className="sub-text">
            {totalNFTsMinted}/{TOTAL_MINT_COUNT} NFTs cunhadas até o momento.
          </p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : (
              (totalNFTsMinted < TOTAL_MINT_COUNT)
                ? <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                  Cunhar NFT
                </button>
                : <p className="sub-text">
                  Quem cunhou, mintou, <br />
                  Quem nao mintou, nao cunha mais!<br />
                  NFTs esgotadas... <br />
                </p>
            )
          }
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`feito com ❤️ pela @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};
export default App;