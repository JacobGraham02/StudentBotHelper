const ConfigurationsPageContent = ({ isUserLoggedIn }: { isUserLoggedIn: boolean}) => {
    if (isUserLoggedIn) {
        return (
            <main id="main">
                <h1 id="configuration_page_for_logged_in_users_title">Configurations</h1>
                <article id="configuration_page_for_logged_in_users_outer_container">
                    <article id="configuration_page_for_logged_in_users_option_names_container">
                        Configuration options
                    </article>
                    <article id="configuration_page_for_logged_in_users_option_values_container">
                        Configuration values
                    </article>
                </article>
            </main>
        )
    }
}

export default ConfigurationsPageContent;