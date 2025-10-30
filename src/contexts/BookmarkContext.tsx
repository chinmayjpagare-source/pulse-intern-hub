import React, { createContext, useContext, useState, ReactNode } from "react";

interface BookmarkContextType {
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
};

interface BookmarkProviderProps {
  children: ReactNode;
}

export const BookmarkProvider: React.FC<BookmarkProviderProps> = ({ children }) => {
  // Load bookmarks from localStorage on mount
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("bookmarked-internships");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(bookmarkId => bookmarkId !== id)
        : [...prev, id];
      
      // Save to localStorage
      localStorage.setItem("bookmarked-internships", JSON.stringify(updated));
      return updated;
    });
  };

  const isBookmarked = (id: string) => {
    return bookmarkedIds.includes(id);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedIds, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};