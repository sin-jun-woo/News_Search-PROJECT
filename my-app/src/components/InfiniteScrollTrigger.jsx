import { useEffect, useRef } from 'react';

const InfiniteScrollTrigger = ({ disabled, onIntersect }) => {
  const targetRef = useRef(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || disabled) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [disabled, onIntersect]);

  return <div ref={targetRef} className="h-1 w-full" />;
};

export default InfiniteScrollTrigger;
