export interface HelpSection {
  type: 'text' | 'heading' | 'list' | 'code';
  content?: string;
  items?: string[];
  language?: string;
}

export interface HelpTopic {
  title: string;
  description: string;
  icon: string;
  sections: HelpSection[];
}

export type HelpContent = {
  [key: string]: HelpTopic;
};
