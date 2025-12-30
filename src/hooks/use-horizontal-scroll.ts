import { RefObject, useCallback, useState } from 'react';

type ScrollViewRef = Readonly<{
  scrollTo: (
    options?: { x?: number; y?: number; animated?: boolean } | number
  ) => void;
}>;

type UseHorizontalScrollProps = Readonly<{
  scrollRef: RefObject<ScrollViewRef>;
}>;

type UseHorizontalScrollReturn = Readonly<{
  scrollHandlers: {
    onScroll: (e: { nativeEvent: { contentOffset: { x: number } } }) => void;
    onLayout: (e: { nativeEvent: { layout: { width: number } } }) => void;
    onContentSizeChange: (width: number) => void;
  };
  scrollActions: {
    scrollLeft: () => void;
    scrollRight: () => void;
  };
  scrollProps: {
    horizontal: true;
    showsHorizontalScrollIndicator: false;
    scrollEventThrottle: 16;
  };
}>;

export function useHorizontalScroll({
  scrollRef,
}: UseHorizontalScrollProps): UseHorizontalScrollReturn {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleScrollLeft = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollIncrement = Math.min(containerWidth * 0.8, 200);
    const newPosition = Math.max(0, scrollPosition - scrollIncrement);
    scrollRef.current.scrollTo({ x: newPosition, animated: true });
  }, [containerWidth, scrollPosition, scrollRef]);

  const handleScrollRight = useCallback(() => {
    if (!scrollRef.current) return;
    const scrollIncrement = Math.min(containerWidth * 0.8, 200);
    const maxScroll = contentWidth - containerWidth;
    const newPosition = Math.min(maxScroll, scrollPosition + scrollIncrement);
    scrollRef.current.scrollTo({ x: newPosition, animated: true });
  }, [containerWidth, contentWidth, scrollPosition, scrollRef]);

  return {
    scrollHandlers: {
      onScroll: (e) => setScrollPosition(e.nativeEvent.contentOffset.x),
      onLayout: (e) => setContainerWidth(e.nativeEvent.layout.width),
      onContentSizeChange: (width) => setContentWidth(width),
    },
    scrollActions: {
      scrollLeft: handleScrollLeft,
      scrollRight: handleScrollRight,
    },
    scrollProps: {
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      scrollEventThrottle: 16,
    },
  };
}
