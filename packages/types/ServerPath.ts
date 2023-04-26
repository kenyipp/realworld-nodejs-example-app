export enum ServerPath {
	HealthCheck = "/api/health-check",
	ResetServer = "/api/reset",
	Login = "/api/users/login",
	Registration = "/api/users",
	GetCurrentUser = "/api/user",
	UpdateUser = "/api/user",
	GetProfile = "/api/profiles/:username",
	FollowUser = "/api/profiles/:username/follow",
	UnfollowUser = "/api/profiles/:username/follow",
	ListArticles = "/api/articles",
	FeedArticles = "/api/articles/feed",
	GetArticle = "/api/articles/:slug",
	CreateArticle = "/api/articles",
	UpdateArticle = "/api/articles/:slug",
	DeleteArticle = "/api/articles/:slug",
	AddCommentToAnArticle = "/api/articles/:slug/comments",
	GetCommentsFromAnArticle = "/api/articles/:slug/comments",
	DeleteComment = "/api/articles/:slug/comments/:id",
	FavoriteArticle = "/api/articles/:slug/favorite",
	UnfavoriteArticle = "/api/articles/:slug/favorite",
	GetTags = "/api/tags",
	GetSwaggerJson = "/assets/swagger.json",
	Documentation = "/",
	Logo = "/images/logo.png",
	GraphQL = "/graphql"
}
