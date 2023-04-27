import { omit } from "lodash";
import pAll from "p-all";

import { DbDtoArticle, DbDtoUser } from "@conduit/core/database/dto";
import { ArticleService, UserService } from "@conduit/core/service";
import { Environments } from "@conduit/types/Environments";
import { indexToDoc, logger } from "@conduit/utils";
import { APIError, APIErrorInternalServerError } from "@conduit/utils/error";

import { DtoArticle, DtoInputGetArticles } from "../dto";

export class APIListArticles {
	private articleService: ArticleService;
	private userService: UserService;

	constructor({ articleService, userService }: APIListArticlesConstructor) {
		this.articleService = articleService;
		this.userService = userService;
	}

	async execute({
		input,
		user
	}: APIListArticlesInput): Promise<APIListArticlesOutput> {
		try {
			const [dbDtoArticles, count] = await pAll(
				[
					() =>
						this.articleService.getArticlesByFilters({ ...input }),
					() =>
						this.articleService.countArticles({
							...omit(input, ["limit", "offset"])
						})
				],
				{
					concurrency:
						process.env.NODE_ENV === Environments.Testing
							? 1
							: Infinity
				}
			);
			if (dbDtoArticles.length < 1 || count < 1) {
				return {
					articles: [],
					articlesCount: 0
				};
			}
			const articles = await this.getArticles({
				articles: dbDtoArticles,
				user
			});
			return {
				articles,
				articlesCount: count
			};
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private async getArticles({
		articles,
		user
	}: {
		articles: DbDtoArticle[];
		user?: DbDtoUser;
	}) {
		const articleIds = articles.map((article) => article.id);
		const authorIds = articles.map((article) => article.userId);
		const articleIdToArticle = indexToDoc(articles, "id");
		const [authorIdToAuthor, articleIdToTags, articleIdToMeta] = await pAll(
			[
				() =>
					this.userService
						.getUserByIds({ ids: authorIds })
						.then((authors) => indexToDoc(authors, "id")),
				() =>
					this.articleService
						.getTagsByArticleIds({ articleIds })
						.then((tags) => indexToDoc(tags, "articleId")),
				() =>
					this.articleService
						.getArticleMetaByIds({
							ids: articleIds,
							userId: user?.id
						})
						.then((meta) => indexToDoc(meta, "id"))
			],
			{
				concurrency:
					process.env.NODE_ENV === Environments.Testing ? 1 : Infinity
			}
		);
		return articleIds
			.map((id) => {
				const article = articleIdToArticle[id]!;
				const author = authorIdToAuthor[article.userId];
				const tag = articleIdToTags[id];
				const meta = articleIdToMeta[id];
				if (!article || !author || !tag || !meta) {
					return undefined;
				}
				return new DtoArticle({
					article,
					author,
					meta,
					tag
				});
			})
			.filter((article) => Boolean(article)) as DtoArticle[];
	}

	private convertErrorToAPIError(error: any) {
		if (error instanceof APIError) {
			return error;
		}
		logger.error(error);
		return new APIErrorInternalServerError({});
	}
}

interface APIListArticlesConstructor {
	articleService: ArticleService;
	userService: UserService;
}

interface APIListArticlesInput {
	input: DtoInputGetArticles;
	user?: DbDtoUser;
}

export interface APIListArticlesOutput {
	articles: DtoArticle[];
	articlesCount: number;
}
