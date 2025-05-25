import { useEffect, useRef, useState } from 'react';
import type { Story, UserStoryGroup } from '../types/story';
import { useSwipeable } from 'react-swipeable';

interface Props {
  selectedUserIndex: number;
  userStories: UserStoryGroup[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewer = ({
  selectedUserIndex,
  userStories,
  initialIndex,
  onClose
}: Props) => {
  const [userIndex, setUserIndex] = useState(selectedUserIndex);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [userAnimate, setUserAnimate] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUser = userStories[userIndex];
  const stories = currentUser.stories;
  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!shouldAnimate || isPaused) return;
    timeoutRef.current = setTimeout(goNext, 5000);
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [userIndex, currentIndex, shouldAnimate, isPaused]);

  const goNext = () => {
    setShouldAnimate(false);
    setIsLoading(true);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else if (userIndex < userStories.length - 1) {
      setUserIndex((u) => u + 1);
      setCurrentIndex(0);
      setUserAnimate(true);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    setShouldAnimate(false);
    setIsLoading(true);
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else if (userIndex > 0) {
      const newUserIndex = userIndex - 1;
      const lastStoryIndex = userStories[newUserIndex].stories.length - 1;
      setUserIndex(newUserIndex);
      setCurrentIndex(lastStoryIndex);
      setUserAnimate(true);
    }
  };

  const goNextUser = () => {
    if (userIndex < userStories.length - 1) {
      setUserIndex((u) => u + 1);
      setCurrentIndex(0);
      setIsLoading(true);
      setShouldAnimate(false);
      setUserAnimate(true);
    }
  };

  const goPrevUser = () => {
    if (userIndex > 0) {
      const newUserIndex = userIndex - 1;
      const lastStoryIndex = userStories[newUserIndex].stories.length - 1;
      setUserIndex(newUserIndex);
      setCurrentIndex(lastStoryIndex);
      setIsLoading(true);
      setShouldAnimate(false);
      setUserAnimate(true);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goNextUser,
    onSwipedRight: goPrevUser,
    onSwipedUp: onClose,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    if (x < width / 2) goPrev();
    else goNext();
  };

  return (
    <div
      {...swipeHandlers}
      data-testid="story-viewer"
      onClick={handleTap}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
      }}
    >
      {/* Progress Bars */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          top: 20,
          left: 10,
          right: 10,
          zIndex: 1000,
          gap: 4,
        }}
      >
        {stories.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '3px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              data-testid="progress-bar"
              data-completed={i < currentIndex || (i === currentIndex && !shouldAnimate && !isLoading)}
              style={{
                height: '100%',
                background: '#fff',
                width: i < currentIndex || (i === currentIndex && !shouldAnimate && !isLoading) ? '100%' : i === currentIndex ? '100%' : '0%',
                animation:
                  i === currentIndex && shouldAnimate && !isPaused
                    ? 'progress 5s linear forwards'
                    : 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* Top Bar: Profile + Username + Close Button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '50px 16px 12px',
          zIndex: 1001,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={currentUser.profilePic}
            alt={currentUser.username}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1.5px solid white',
            }}
          />
          <span style={{ fontWeight: 500, color: 'white', fontSize: '14px' }}>{currentUser.username}</span>
        </div>

        <button
          data-testid="close-button"
          onClick={onClose}
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#fff',
            padding: '6px 10px',
            fontSize: '18px',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
          aria-label="Close story viewer"
        >
          ✕
        </button>
      </div>

      {/* Story Image with User Change Animation */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '0 12px',
          transition: userAnimate ? 'opacity 0.5s ease, transform 0.5s ease' : undefined,
          opacity: userAnimate ? 0 : 1,
          transform: userAnimate ? 'scale(0.95)' : 'scale(1)',
        }}
        onTransitionEnd={() => setUserAnimate(false)}
      >
        {isLoading && (
          <div data-testid="loading-indicator" style={{ position: 'absolute', top: '50%', color: 'white' }}>Loading...</div>
        )}
        <img
          data-testid="story-image"
          src={currentStory.imageUrl}
          alt={`Story ${currentStory.id}`}
          onLoad={() => {
            setIsLoading(false);
            setShouldAnimate(true);
          }}
          style={{
            maxHeight: '95%',
            maxWidth: '100%',
            objectFit: 'contain',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>
    </div>
  );
};
