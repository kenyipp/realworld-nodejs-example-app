import { ArticleService } from "@conduit/core/service";
import { APIErrorInternalServerError, logger } from "@conduit/utils";

export class APIGetTags {
	private articleService: ArticleService;

	constructor({ articleService }: APIGetTagsConstructor) {
		this.articleService = articleService;
	}

	async execute(): Promise<APIGetTagsOutput> {
		try {
			const tags = await this.articleService.getAllTags();
			return { tags };
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private convertErrorToAPIError(error: any) {
		logger.error(error);
		return new APIErrorInternalServerError({});
	}
}

interface APIGetTagsConstructor {
	articleService: ArticleService;
}

interface APIGetTagsOutput {
	tags: string[];
}
