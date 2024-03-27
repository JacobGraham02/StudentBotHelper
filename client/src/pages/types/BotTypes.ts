import { UUID} from "crypto";

export type BotConfiguration = {
    guildId: string;
    commandChannelId: string;
    buttonChannelId: string;
    botInfoChannelId: string;
    botErrorChannelId: string;
};

export type Bot = {
  botId: UUID;
  botEmail: string;
  botPassword: string;
}
  
export type BotCommand = {
    botId: string,
    botGuildId: string,
    commandName: string,
    commandDescription: string,
    commandDescriptionForFunction: string;
    commandAuthorizedUsers: string[];
};

export type LogsForm = {
  infoLog: {
    name: string;
    uri: string;
  }
  errorLog: {
    name: string;
    uri: string;
  }
}

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

export type ProfileInfoForm = {
  name: {
    value: string;
    valid: boolean;
    touched: boolean;
    error: string;
  };
  email: {
    value: string;
    valid: boolean;
    touched: boolean;
    error: string;
  }
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