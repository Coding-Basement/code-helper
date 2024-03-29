declare global {
   namespace NodeJS {
      interface ProcessEnv {
         NODE_ENV: 'development' | 'production';
         TOKEN: string;
         RULES_CHANNEL_ID: string;
         PREFIX: string;
         GUILD_ID: string;
         MENTION_DEVELOPER_ROLE_ID: string;
         DEVELOPER_ROLE_ID: string;
         GET_ROLES_CHANNEL_ID: string;
         DEVELOPER_EMOJI_ID: string;
         MENTION_DEVELOPER_EMOJI_ID: string;
         RANNA_AUTH_USERNAME: string;
         RANNA_AUTH_PASSWORD: string;
         UPLOAD_KEY: string;
         AUTO_REACTION_CHANNELS: string;
         CHANNEL_APPLICATIONS: string;
         YOUTUBE_CHANNEL_ID: string;
         YOUTUBE_DISCORD_CHANNEL_ID: string;
         PORT: number;
         DISCORD_CODING_BETA: string;
         DISCORD_CODING_BETA_NOTIFY: string;
         API_SECRET: string;
         SUGGESTIONS_CHANNELS: string;
      }
   }
}

export {};
