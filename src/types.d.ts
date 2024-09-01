export interface Webtoon {
  id: number;
  name: string;
  cover_image: string;
  genres: string[];
  total_chapters: number;
  status: string;
  is_favorite: boolean;
  last_read_chapter?: {
    id: number;
    number: number;
  } | null;
}
export interface WebtoonDetailType {
  id: number;
  name: string;
  cover_image: string;
  author: string;
  artist: string;
  status: string;
  summary: string;
  chapters: Chapter[];
  genres: string[];
  rating: number;
  is_favorite: boolean;
  last_read_chapter?: LastReadChapter | null;
}

export interface Chapter {
  id: number;
  title: string;
  chapter_number: string;
  release_date: string;
  chapter_id: number;
  is_new: boolean;
}

export interface ChapterImage {
  id: string;
  image_url: string;
}

export interface ChapterInfo {
  id: number;
  number: number;
}

export interface ChapterData {
  webtoon_name: string;
  current_chapter: ChapterInfo;
  previous_chapter: ChapterInfo | null;
  next_chapter: ChapterInfo | null;
  images: ChapterImage[];
}

export interface LastReadChapter {
  id: number;
  number: number;
}
