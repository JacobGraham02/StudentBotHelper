const Footer = () => {
  return (
    <footer id="footer">
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
    </footer>
  );
};

export default Footer;
