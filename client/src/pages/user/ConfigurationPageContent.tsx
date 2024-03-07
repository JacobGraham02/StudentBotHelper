const ConfigurationPageContent = ({userLoggedIn}: {userLoggedIn:boolean}) => {
    if (userLoggedIn) {
        return (
            <main id="main">
                <aside id="bot_configuration_options_page_content">
                    <h1 id="bot_onfiguration_options_page_title">Bot configuration options</h1>
                </aside>
                <p id="bot_configuration_options_page_message">
                    Modify the configuration options for your bot below:
                </p>

                <section className="bot_configuration_options_form_section">
                    <form id="bot_configuration_options_form" method="POST" action="http://localhost:8080/api/testroute">
                        <fieldset className="bot_configuration_options_form_fieldset">
                            <label className="bot_configuration_options_label" htmlFor="bot_configurations_discord_guild_id_input"/>
                            <input className="bot_configuration_options_input" type="text" name="bot_configurations_discord_guild_id_input"
                            placeholder="18 digits (e.g., 123456789123456789)" pattern="[0-9]{18}" title="Please enter a valid 18-digit number: (e.g., 123456789123456789)" 
                            required/>
                        </fieldset>

                        <fieldset className="bot_configuration_options_form_fieldset">
                            <label className="bot_configuration_options_label" htmlFor="bot_configurations_discord_command_channel_input"/>
                            <input className="bot_configuration_options_input" type="text" name="bot_configurations_discord_command_channel_input"
                            placeholder="18 digits (e.g., 123456789123456789)" pattern="[0-9]{18}" title="Please enter a valid 18-digit number: (e.g., 123456789123456789)" 
                            required/>
                        </fieldset>

                        <fieldset className="bot_configuration_options_form_fieldset">
                            <label className="bot_configuration_options_label" htmlFor="bot_configurations_discord_database_responses_id_input"/>
                            <input className="bot_configuration_options_input" type="text" name="bot_configurations_discord_database_responses_id_input"
                            placeholder="18 digits (e.g., 123456789123456789)" pattern="[0-9]{18}" title="Please enter a valid 18-digit number: (e.g., 123456789123456789)" 
                            required/>
                        </fieldset>

                        <fieldset className="bot_configuration_options_form_fieldset">
                            <label className="bot_configuration_options_label" htmlFor="bot_configurations_discord_bot_role_button_channel_id_input"/>
                            <input className="bot_configuration_options_input" type="text" name="bot_configurations_discord_bot_role_button_channel_id_input"
                            placeholder="18 digits (e.g., 123456789123456789)" pattern="[0-9]{18}" title="Please enter a valid 18-digit number: (e.g., 123456789123456789)" 
                            required/>
                        </fieldset>

                        <fieldset className="bot_configuration_options_form_fieldset">
                            <label className="bot_configuration_options_label" htmlFor="bot_configurations_discord_voice_channel_category_id_input"/>
                            <input className="bot_configuration_options_input" type="text" name="bot_configurations_discord_voice_channel_category_id_input"
                            placeholder="18 digits (e.g., 123456789123456789)" pattern="[0-9]{18}" title="Please enter a valid 18-digit number: (e.g., 123456789123456789)" 
                            required/>
                        </fieldset>

                        <fieldset className="bot_configuration_options_form_fieldset">
                            <label className="bot_configuration_options_label" htmlFor="bot_configurations_discord_information_messages_channel_id_input"/>
                            <input className="bot_configuration_options_input" type="text" name="bot_configurations_discord_information_messages_channel_id_input"
                            placeholder="18 digits (e.g., 123456789123456789)" pattern="[0-9]{18}" title="Please enter a valid 18-digit number: (e.g., 123456789123456789)" 
                            required/>
                        </fieldset>

                        <fieldset className="bot_configuration_options_form_fieldset">
                            <label className="bot_configuration_options_label" htmlFor="bot_configurations_discord_error_messages_channel_id_input"/>
                            <input className="bot_configuration_options_input" type="text" name="bot_configurations_discord_error_messages_channel_id_input"
                            placeholder="18 digits (e.g., 123456789123456789)" pattern="[0-9]{18}" title="Please enter a valid 18-digit number: (e.g., 123456789123456789)"
                            required/>
                        </fieldset>

                        <aside id="bot_configuration_options_form_buttons_article">
                            <button className="bot_form_button" type="submit">Change bot settings</button>
                            <button className="bot_form_button" type="reset">Erase input fields</button>
                            <button className="bot_form_button" type="button">Cancel</button>
                        </aside>
                    </form>
                </section>
            </main>
        )
    }
};

export default ConfigurationPageContent;