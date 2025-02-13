import { PostsRepository } from '../repositories/posts.repository.js';

export class PostsService {
  postsRepository = new PostsRepository();

  async findAllPosts() {
    const posts = await this.postsRepository.findAllPosts();

    // 게시글을 생성 날짜로 부터 내림차순 정렬
    posts.sort((a, b) => b.createdAt - a.createdAt);

    // Service -> Controller에게 전달
    return posts.map((post) => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  }

  async createPost(nickname, password, title, content) {
    const createdPost = await this.postsRepository.createPost(nickname, password, title, content);

    return {
      postId: createdPost.postId,
      nickname: createdPost.nickname,
      title: createdPost.title,
      content: createdPost.content,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
    };
  }
}
