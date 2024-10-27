import { ArticleService } from '@conduit/core/service';
import { ApiErrorInternalServerError } from '@conduit/utils';

import { ApiGetTagsConstructor, ApiGetTagsOutput } from './types';

export class ApiGetTags {
  private articleService: ArticleService;

  constructor({ articleService }: ApiGetTagsConstructor) {
    this.articleService = articleService;
  }

  async execute(): ApiGetTagsOutput {
    try {
      const tags = await this.articleService.getAvailableTags();
      return { tags };
    } catch (error) {
      throw new ApiErrorInternalServerError({});
    }
  }
}
