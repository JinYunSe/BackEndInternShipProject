import { PostsService } from '../services/posts.service.js';

export class PostsController {
  postsService = new PostsService();

  // 게시글 조회 API
  async getPost(req, res, next) {
    try {
      const posts = await this.postsService.findAllPosts();
      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  // 게시글 생성 API
  async createPost(req, res, next) {
    try {
      const { nickname, password, title, content } = req.body;

      const createdPost = await this.postsService.createPost(nickname, password, title, content);
      return res.status(201).json(createdPost);
    } catch (error) {
      next(error);
    }
  }
}
