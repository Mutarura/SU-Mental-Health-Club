export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  created_at: string;
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
  created_at?: string;
};

export type ClubCouncilMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  year: string;
  photo_url?: string;
  email: string;
  linkedin_url?: string;
  created_at: string;
};

export type AboutContent = {
  id: number;
  mission: string;
  vision: string;
  history: string;
  values: string[];
  created_at?: string;
  updated_at?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url?: string;
  email: string;
  linkedin_url?: string;
  created_at?: string;
};

export type Footer = {
  id: string;
  med_centre_contact: string;
  club_email: string;
  emergency_numbers: string;
  updated_at?: string;
};

export type Admin = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};
