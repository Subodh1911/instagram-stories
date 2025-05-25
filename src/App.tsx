import { useEffect, useState } from 'react';
import { StoryViewer } from './components/StoryViewer';
import { StoryList } from './components/StoryList';
import type { UserStoryGroup } from './types/story';

function App() {
  const [userStories, setUserStories] = useState<UserStoryGroup[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserStoryGroup | null>(null);

  useEffect(() => {
    fetch('/src/data/stories.json')
      .then((res) => res.json())
      .then(setUserStories)
      .catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: '375px', margin: '0 auto' }}>
      {selectedUser ? (
        <StoryViewer
          selectedUserIndex={selectedUser.userId - 1}
          userStories={userStories}
          initialIndex={0}
          onClose={() => setSelectedUser(null)}
        />
      ) : (
        <StoryList onSelect={setSelectedUser} />
      )}
    </div>
  );
}

export default App;
