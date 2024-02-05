import { Link } from "react-router-dom"

const CommandsPageContent = ({ isUserLoggedIn /*, listOfCommands */ }: { isUserLoggedIn: boolean, /* listOfCommands: Array or other contiguous memory structure */}) => {
    if (isUserLoggedIn) {
        return (
            <main id="main">
                <h1 id="commands_page_for_logged_in_user_title">Commands</h1>
                <article id="commands_page_for_logged_in_user_outer_container">
                    <Link id="commands_page_for_logged_in_user_create_command" to="/createcommand" title="A link that goes to the create bot command page">
                        Create bot command
                    </Link>

                    <article id="commands_page_for_logged_in_user_inner_command_container">
                        {/* A parameter, such as 'listOfCommands', will be passed into the function that will be the list of available commands. */}
                    </article>

                    <article id="commands_page_for_logged_in_user_inner_pagination_container">

                    </article>
                </article>
            </main>
        )
    }
}

export default CommandsPageContent;