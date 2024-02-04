const LogsPageContent = ({ isUserLoggedIn }: { isUserLoggedIn: boolean}) => {
    if (isUserLoggedIn) {
        return (
            <main id="main">
                <h1 id="logs_page_for_logged_in_users_title">Log files</h1>
                <h3 className="logs_page_for_logged_in_users_information_message">Click on any of the log files to view its contents</h3>
                <article id="logs_page_for_logged_in_users_outer_container">
                    <article id="logs_page_for_logged_in_users_inner_administrative_information_logs_container">
                        This container will contain log files that contain information for administrators and developers
                    </article>
                    <article id="logs_page_for_logged_in_users_inner_database_operations_logs_container">
                        This container will contain log files that contain database operation information for administrators and developers
                    </article>
                    <article id="logs_page_for_logged_in_users_inner_user_interactions_logs_container">
                        This container will contain log files that contain user interaction information for administrators and developers 
                    </article>
                </article>
            </main>
        )
    }
}

export default LogsPageContent;