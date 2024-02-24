const CommandsPageContent = ({userLoggedIn}: {userLoggedIn:boolean}) => {
    if (userLoggedIn) {
        return (
            <main id="main">
                <aside id="bot_interface_commands_page_content">
                    <h1 id="bot_interface_commands_page_title">Bot commands</h1>
                </aside>
                <p id="bot_inteface_commands_page_message">
                    Click on any of the bot commands listed below to view their contents or edit them. Additionally,
                    you can also click on the 'Add command' text if you want to add a command to the bot
                </p>
            </main>
        );
    } 
};

export default CommandsPageContent;