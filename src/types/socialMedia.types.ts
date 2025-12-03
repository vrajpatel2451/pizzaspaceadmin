// Social Media Types

export interface SocialMediaResponse {
  _id: string;
  name: string;
  logo: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialMediaCreateData {
  name: string;
  logo: string;
  link: string;
}

export interface SocialMediaUpdateData {
  name?: string;
  logo?: string;
  link?: string;
}
