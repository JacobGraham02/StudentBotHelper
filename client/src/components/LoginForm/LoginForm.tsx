import React from 'react';

const SupportPage = () => {
  
  const handleSubmit:  React.FormEventHandler<HTMLFormElement> = function(event: React.FormEvent<HTMLFormElement> ) {
    event.preventDefault();
    
  };

  return (
    <main id="main">
      <section id="login_form_section">
        <article id="account_login_form_information">
          <p id="account_login_form_fields_information">
            To log in to the account that is associated with your Discord bot, must type in your email address and password into the 
            corresponding fields in the form below. Optionally, you can also use one of the easy single-click sign on methods listed below.
          </p>
        </article>
        <article id="login_information_messages_article">
          {/* Messages or feedback can be rendered here */}
        </article>
        <form id="account_login_form" action="/login" method="post" onSubmit={handleSubmit}>
          <label htmlFor="username" id="account_login_form_username_label">Email address:</label>
          <input type="text" id="account_login_form_username_input" name="username" />

          <label htmlFor="password" id="account_login_form_password_label">Password:</label>
          <input type="password" id="account_login_form_password_input" name="password" />

          <article id="account_login_form_button_container">
            <button type="submit" id="account_login_form_submit_login">Log in</button>
            <button type="reset" id="account_login_form_submit_login">Cancel</button>
          </article>
        </form>
      </section>
    </main>
  );
};

export default SupportPage;
