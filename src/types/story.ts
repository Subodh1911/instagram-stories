export interface Story {
  id: number;
  imageUrl: string;
}

export interface UserStoryGroup {
  userId: number;
  username: string;
  profilePic: string;
  stories: Story[];
}
