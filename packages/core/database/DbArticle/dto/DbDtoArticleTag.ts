import { RecordStatus } from '@conduit/core/types';

export class DbDtoArticleTag {
  id: string;
  articleId: string;
  tag: string;
  recordStatus: RecordStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    articleId,
    tag,
    recordStatus,
    createdAt,
    updatedAt
  }: DbDtoArticleTagConstructor) {
    this.id = id;
    this.articleId = articleId;
    this.tag = tag;
    this.recordStatus = recordStatus;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

interface DbDtoArticleTagConstructor {
  id: string;
  articleId: string;
  tag: string;
  recordStatus: RecordStatus;
  createdAt: Date;
  updatedAt: Date;
}
