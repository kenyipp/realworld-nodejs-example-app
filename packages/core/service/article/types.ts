import { RepoArticle } from '@conduit/core/repository';

export interface ArticleServiceConstructor {
  repoArticle: RepoArticle;
}

export {
  GetArticleByIdInput,
  GetArticleByIdOutput,
  GetArticleBySlugInput,
  GetArticleBySlugOutput,
  DeleteArticleByIdInput,
  DeleteArticleByIdOutput,
  GetTagsByArticleIdsInput,
  GetTagsByArticleIdsOutput,
  GetAvailableTagsOutput,
  GetArticleCommentsByArticleIdInput,
  GetArticleCommentsByArticleIdOutput,
  CountArticleCommentsByArticleIdInput,
  CountArticleCommentsByArticleIdOutput,
  GetArticleCommentByIdInput,
  GetArticleCommentByIdOutput,
  CountArticlesInput,
  CountArticlesOutput,
  GetArticlesInput,
  GetArticlesOutput,
  GetTagsByArticleIdInput,
  GetTagsByArticleIdOutput,
  DeleteArticleCommentByIdInput,
  DeleteArticleCommentByIdOutput
} from '@conduit/core/repository/RepoArticle/types';
