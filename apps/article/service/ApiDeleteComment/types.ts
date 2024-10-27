import { ArticleService } from '@conduit/core/service';

export interface ApiDeleteCommentConstructor {
  articleService: ArticleService;
}

export interface ApiDeleteCommentInput {
  commentId: string;
  userId: string;
}

export type ApiDeleteCommentOutput = Promise<void>;
