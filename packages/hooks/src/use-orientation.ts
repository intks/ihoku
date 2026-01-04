import { useEffect, useState } from 'react';

export interface OrientationState {
  angle: number;
  type: OrientationType;
}

const useOrientation = (): OrientationState | null => {
  const [orientation, setOrientation] = useState<OrientationState | null>(() => {
    if (typeof window === 'undefined' || !window.screen?.orientation) {
      return null;
    }
    return {
      angle: window.screen.orientation.angle,
      type: window.screen.orientation.type,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.screen?.orientation) {
      return;
    }

    const handleChange = () => {
      setOrientation({
        angle: window.screen.orientation.angle,
        type: window.screen.orientation.type,
      });
    };

    window.screen.orientation.addEventListener('change', handleChange);

    return () => {
      window.screen.orientation.removeEventListener('change', handleChange);
    };
  }, []);

  return orientation;
};

export default useOrientation;

