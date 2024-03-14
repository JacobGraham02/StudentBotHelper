export interface ApplicationConfigs {
  custom_install_url?: string;
  description?: string;
  role_connections_verification_url?: string;
  install_params?: InstallParams;
  flags?: ApplicationFlags;
  icon?: string;
  cover_image?: string;
  interactions_endpoint_url?: string;
  tags?: string[];
}

export interface ApplicationCommandParams {
  name: string;
  name_localizations?: LocalizationDictionary;
  description?: string;
  description_localizations?: LocalizationDictionary;
  options?: ApplicationCommandOption[];
  default_member_permissions?: string | number;
  default_permission?: boolean;
  type?: ApplicationCommandType;
  nsfw?: boolean;
}

interface InstallParams {
  redirect_uri?: string;
  scopes?: string[];
}

enum ApplicationFlags {
  ExampleFlag = 1,
}

interface LocalizationDictionary {
  [locale: string]: string;
}

enum ApplicationCommandType {
  CHAT_INPUT = 1, // Slash commands
  USER = 2, // User commands
  MESSAGE = 3, // Message commands
}

interface ApplicationCommandOption {
  type: string;
  name: string;
  description: string;
}
