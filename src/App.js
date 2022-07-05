import React, { useEffect } from "react";
import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
// Constants
const TWITTER_HANDLE = "Web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;
const App = () => {
  const checkIfWalletIsConnected = () => {
    /*
     * Primeiro tenha certeza que temos acesso a window.ethereum
     */
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Certifique-se que você tem metamask instalado!");
      return;
    } else {
      console.log("Temos o objeto ethereum!", ethereum);
    }
  };
  // Métodos para Renderizar
  const renderNotConnectedContainer = () => (
    <button className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  /*
   * Isso roda nossa função quando a página carrega.
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção NFT</p>
          <p className="sub-text">Exclusivos! Maravilhosos! Únicos! Descubra seu NFT hoje.</p>
          {/* adicione o seu render method aqui */}
          {renderNotConnectedContainer()}
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