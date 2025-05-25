import { useEffect, useState } from 'react';
import type { UserStoryGroup } from '../types/story';

export const StoryList = ({ onSelect }: { onSelect: (group: UserStoryGroup) => void }) => {
  const [userStories, setUserStories] = useState<UserStoryGroup[]>([]);

  useEffect(() => {
    fetch('/src/data/stories.json')
      .then((res) => res.json())
      .then(setUserStories)
      .catch(console.error);
  }, []);

  return (
    <div style={{ display: 'flex', overflowX: 'auto', padding: '10px' }}>
      {userStories.map((user) => (
        <div
          key={user.userId}
          onClick={() => onSelect(user)}
          style={{
            marginRight: '10px',
            cursor: 'pointer',
            textAlign: 'center',
            flexShrink: 0
          }}
        >
          <img
            data-testid="story-thumbnail"
            src={user.profilePic}
            alt={user.username}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '2px solid #f56040'
            }}
          />
          <div style={{ fontSize: '12px', color: '#333', marginTop: '4px' }}>
            {user.username}
          </div>
        </div>
      ))}
    </div>
  );
};
