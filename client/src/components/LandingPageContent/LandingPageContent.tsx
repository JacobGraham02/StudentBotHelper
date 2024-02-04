const LandingPageContent = ({ userLoggedIn }: {userLoggedIn: boolean}) => {
  if (userLoggedIn) {
    return (
      <main id="main">
      <aside id="bot_interface_welcome_container">
        <h1 id="bot_interface_index_title">Welcome back, username!</h1>
        <p id="bot_interface_index_message">
          Please use any option from the left-hand navigation menu or click "More information for more information about your Discord server bot, and what settings you can create, delete, and modify using this web portal"
        </p>
      </aside>
    </main>
    );
  } else {
    return (
      <main id="main">
        <aside id="bot_interface_welcome_container">
            <h1 id="bot_interface_index_title">Welcome to the Student Bot Helper web portal!</h1>
            <p id="bot_interface_index_message">
                Please log in to your account from the left-hand navigation menu or click "More information" for more information about your Discord server bot, and what settings you can create, delete, and modify using this web portal.
            </p>
        </aside>
      </main>
    )
  }
};

export default LandingPageContent;


