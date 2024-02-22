const ConfigurationPageContent = ({userLoggedIn}: {userLoggedIn:boolean}) => {
    if (userLoggedIn) {
        return (
            <main id="main">
                <aside id="bot_interface_configuration_options_page_content">
                    <h1 id="bot_interface_configuration_options_page_title">Bot configuration options</h1>
                </aside>
                <p id="bot_interface_configuration_options_page_message">
                    Modify the configuration options for your bot below:
                </p>
            </main>
        )
    }
};

export default ConfigurationPageContent;