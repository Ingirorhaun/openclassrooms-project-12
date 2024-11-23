import { Logo } from "./logo";

export const Header = () => {
    return (
      <header className="header">
        <Logo />
        <nav>
          <a href="#">Accueil</a>
          <a href="#">Profil</a>
          <a href="#">Réglage</a>
          <a href="#">Communauté</a>
        </nav>
      </header>
    );
  };