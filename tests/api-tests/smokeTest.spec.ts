import { test } from '../../utils/fixtures';
import { expect } from '../../utils/custom_expect';
import { createToken } from '../../helpers/createToken';
import { validateSchema } from '../../utils/schema-validator';
import articleRequestBody from '../../request-objects/articles/POST-article.json'

test('Get Articles', { tag: ['@smoke', '@articles', '@regression'] }, async ({ api }) => {

    const response = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        // .clearAuth()
        .getRequest(200);
    await expect(response).shouldMatchSchema('articles', 'GET_articles');

    expect(response.articles.length).shouldBeLessThanOrEqual(15);
    expect(response.articles.length).shouldEqual(10);
    expect(response.articlesCount).shouldEqual(10);

    const firstArticle = response.articles[0];
    expect(firstArticle.slug).toBeTruthy();
    expect(firstArticle.title).toBeTruthy();
    expect(firstArticle.author).toBeTruthy();

});

test('Get Tags', { tag: ['@smoke', '@tags', '@regression'] }, async ({ api }) => {

    const response = await api
        .path('/tags')
        .getRequest(200);

    await expect(response).shouldMatchSchema('tags', 'GET_tags');
    expect(response.tags[0]).shouldEqual('Test');
    expect(response.tags.includes('YouTube')).toBeTruthy();

    expect(response.tags.length).shouldEqual(10);
    expect(response.tags.length).toBeLessThanOrEqual(10);
    // console.log(response);

});

test('Create and Delete Article', { tag: ['@smoke', '@articles'] }, async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequestBody)
        .postRequest(201);
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_article');
    expect(createArticleResponse.article.title).toContain("New Article");
    expect(createArticleResponse.article.slug).toBeTruthy();
    expect(createArticleResponse.article.description).shouldEqual(articleRequestBody.article.description);
    expect(createArticleResponse.article.body).shouldEqual(articleRequestBody.article.body);
    expect(createArticleResponse.article.tagList).toEqual(articleRequestBody.article.tagList);
    const articleSlug = createArticleResponse.article.slug;


    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articlesResponse.articles[0].title).toContain("New Article");
    expect(articlesResponse.articles[0].slug).shouldEqual(articleSlug);

    await api
        .path(`/articles/${articleSlug}`)
        .deleteRequest(204);

    const articlesResponseCheck = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articlesResponseCheck.articles[0].title).not.toContain("New Article");
    const slugsAfterDelete = articlesResponseCheck.articles.map((a: any) => a.slug);
    expect(slugsAfterDelete.includes(articleSlug)).toBeFalsy();

});

test('Create Update and Delete Article', { tag: ['@articles', '@regression', '@crud'] }, async ({ api }) => {
    const createArticleResponse = await api
        .path('/articles')
        .body(articleRequestBody)
        .postRequest(201);

    expect(createArticleResponse.article.title).toContain("New Article");
    expect(createArticleResponse.article.slug).toBeTruthy();
    expect(createArticleResponse.article.description).shouldEqual(articleRequestBody.article.description);
    expect(createArticleResponse.article.tagList).toEqual(articleRequestBody.article.tagList);
    const articleSlug = createArticleResponse.article.slug;

    const updateRequestBody = JSON.parse(JSON.stringify(articleRequestBody));
    updateRequestBody.article.title = "Updated Article Title";
    const updateArticleResponse = await api
        .path(`/articles/${articleSlug}`)
        .body(updateRequestBody)
        .putRequest(200);
    expect(updateArticleResponse.article.title).toContain("Updated Article Title");
    expect(updateArticleResponse.article.description).shouldEqual(articleRequestBody.article.description);
    expect(updateArticleResponse.article.slug).toBeTruthy();
    const updatedArticleSlug = updateArticleResponse.article.slug;

    const articlesResponse = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articlesResponse.articles[0].title).toContain("Updated Article Title");
    expect(articlesResponse.articles[0].slug).shouldEqual(updatedArticleSlug);


    await api
        .path(`/articles/${updatedArticleSlug}`)
        .deleteRequest(204);


    const articlesResponseCheck = await api
        .path('/articles')
        .params({ limit: 10, offset: 0 })
        .getRequest(200);
    expect(articlesResponseCheck.articles[0].title).not.toContain("Updated Article Title");
    const slugsAfterDelete = articlesResponseCheck.articles.map((a: any) => a.slug);
    expect(slugsAfterDelete.includes(updatedArticleSlug)).toBeFalsy();

});



