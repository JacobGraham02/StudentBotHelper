const Footer = () => {
  return (
    <footer id="footer" className="footer mt-auto py-3 bg-light fixed-bottom">
      <p className="bot_repository_link">
        See the Student Bot Helper GitHub repository{' '}
        <a
          className="github_repository"
          href="https://github.com/JacobGraham02/StudentBotHelper"
          title="A URL to the GitHub repository that contains the Student Bot Helper code"
        >
          here (privated)
        </a>
      </p>
      <p className="bot_wiki_link">
        See the official Student Bot Helper{' '}
        <a
          className="wiki_link"
          href="https://github.com/JacobGraham02/StudentBotHelper/wiki"
          title="A URL to the GitHub repository wiki page that contains information about Student Bot Helper"
        >
          wiki
        </a>
      </p>

      <p id="footer_copyright">&copy; 2024 Jacob Graham jakegraham54@gmail.com. All rights reserved. </p>
    </footer>
  );
};

export default Footer;
