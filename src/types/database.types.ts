export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  start: string;
  end: string;
  location: string;
  calendar_link?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
};

export type Resource = {
  id: string;
  title: string;
  category: string;
  description: string;
  url_or_storage_path?: string;
  tags?: string[];
  image_url?: string;
  created_at: string;
};

export type Quote = {
  id: string;
  text: string;
  author: string;
  created_at: string;
};

export type CouncilLeader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  year: string;
  photo_url?: string;
  email: string;
  linkedin_url?: string;
  created_at?: string;
  updated_at?: string;
};
