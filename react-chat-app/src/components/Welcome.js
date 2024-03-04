import React from "react";
import { Link } from "react-router-dom";
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="container-main">
      <nav className="navbar navbar-expand-lg navbar-hi5 navbar-light ">
        <Link className="navbar-brand display-3" to="/">
          <div className="navbar-brand display-3">Hi5</div>
        </Link>
        <ul className="navbar-nav ml-auto mr-4">
          <div className="row">
            <li className="nav-item active">
              <a className="nav-link h3" href="/dashboard">
                <img className="icon-width" src={process.env.PUBLIC_URL + "/icon-dashboard.svg"} alt="Dashboard" title="Dashboard"/>
              </a>
            </li>
            <li className="nav-item active pl-4">
              <a className="nav-link h3" href="/">
                <img className="icon-width" src={process.env.PUBLIC_URL + "/icon-back.svg"} alt="Home" title="Home"/>
              </a>
            </li>
          </div>
        </ul>
      </nav>
      <div className="container text-styles features pt-5">
        <div className="row ml-5 mr-5">
          <div className="display-3 pb-4 heading-welcome">Willkommen bei Hi5, der Chat-App für jeden.</div>
          <h2>Einen Raum betreten</h2>
          <p>
              Auf der <Link to="/">Startseite</Link> können Sie sich entscheiden, einem Raum beizutreten oder komfortabel einen Raum zu erstellen. <br />
              Wenn Sie die erste Methode wählen, müssen Sie einen Nutzernamen vergeben und den Raum, den Sie betreten möchten, eingeben.
              Anschließend können Sie den Raum betreten. <br />
              Wenn Sie die zweite Methode wählen, müssen Sie ausschließlich Ihren Nutzernamen vergeben. 
              Danach können Sie umgehend den Raum durch einen Klick auf den Button betreten. Dabei wird für Sie ein neuer Raum erstellt.
          </p>
          <h2>Jemanden in einen Raum einladen</h2>
          <p>
              Sie können andere Personen in Ihren Raum einladen, indem Sie das Kopieren-Symbol in der Rechten oberen Ecke drücken.
              Dabei wird ein Link in Ihre Zwischenablage kopiert, den Sie einer anderen Person zukommenlassen können. <br />
              Alternativ können Sie Ihren gewünschten Chat-Partnern den Raumnamen, den Sie oben mittig finden, mitteilen. 
          </p>
          <h2>Chatten</h2>
          <p>
              Im Raum angekommen, können Sie sich mit Ihren Freunden und Kollegen austauschen. <br />
              Wenn Sie einem anderen Raum beitreten möchten, drücken Sie das Zurück-Symbol in der oberen rechten Ecke. 
              Sie gelangen anschließend wieder zur Startseite zurück.
          </p>
          <h2>Ein Planning Poker starten</h2>
          <p>
              Für unsere Softwareentwickler haben wir ein besonderes Feature eingebaut: <br />
              Sie haben nun die Möglichkeit, Ihr Planning Poker auch hier in Hi5 abzuhalten. 
              Wenn Sie eine Chat-Nachricht mit einem <i>#</i> beginnen, 
              können Sie eine Planning-Poker-Schätzung für Ihr gewünschtes Product Backlog Item (PBI) starten.
              Anschließend können alle sich im Raum befindenen Kollegen Ihre Schätzung abgeben.
              Die Person, die das Planning Poker gestartet hat, kann nun die Abstimmung beenden.
              Darauffolgend wird die Auswertung ausgegeben.
          </p>
          <h2>Das Dashboard ansehen</h2>
          <p>
              Unsere Statistik-Begeisterten haben die Möglichkeit, einige Auswertungen in unserem <Link to="/dashboard">Dashboard</Link> zu betrachten.
              Dort wird Ihnen die Gesamtzahl der Benutzer, Räume und Nachrichten angezeigt. 
              Auch eine Auswertung über die letzten 30 Tage können Sie dort finden.
          </p>
        </div>
      </div> 
    </div>
  );
};

export default Welcome;
