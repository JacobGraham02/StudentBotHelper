export type BotConfiguration = {
    guildId: string;
    commandChannelId: string;
    buttonChannelId: string;
    botInfoChannelId: string;
    botErrorChannelId: string;
};
  
export type CommandOption = {
    command_option_name: string,
    command_option_description: string,
    command_option_required: boolean
};
  
export type BotCommand = {
    name: string,
    description: string,
    command_option: CommandOption[];
    authorization_role_name: string[];
    execute_function_body: Function;
};

export type CommandsForm = {
    commandName: {
      value: string;
      valid: boolean;
      touched: boolean;
      error: string;
    };
    commandDescription: {
      value: string;
      valid: boolean;
      touched: boolean;
      error: string;
    };
    commandOptions: {
        value: CommandOption[];
        valid: boolean;
        touched: boolean;
        error: string;
    };
    commandAuthorizedUser: {
        value: string;
        valid: boolean;
        touched: boolean;
        error: string;
    };
    commandDescriptionForFunction: {
      value: string,
      error: string,
      valid: boolean,
      touched: boolean
    };

    commandAuthorizedUsers: string[]
};

export type RegexPatterns = {
  [key: string]: RegExp;
}

export type ConfigurationForm = {
    guildId: {
      value: string;
      valid: boolean;
      touched: boolean;
      error: string;
    };
    commandChannelId: {
      value: string;
      valid: boolean;
      touched: boolean;
      error: string;
    };
    buttonChannelId: {
      value: string;
      valid: boolean;
      touched: boolean;
      error: string;
    };
    botInfoChannelId: {
      value: string;
      valid: boolean;
      touched: boolean;
      error: string;
    };
    botErrorChannelId: {
      value: string;
      valid: boolean;
      touched: boolean;
      error: string;
    };
};