import { PostsService } from '../services/posts.service.js';

const postsService = new PostsService();
export class PostsController {
  postsService = new PostsService();

  // 게시글 조회 API
  async getPost(req, res, next) {
    try {
      const posts = await postsService.findAllPosts();

      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  // 게시글 생성 API
  async createPost(req, res, next) {
    try {
      const { nickname, password, title, content } = req.body;

      const createdPost = await postsService.createPost(nickname, password, title, content);
      return res.status(201).json(createdPost);
    } catch (error) {
      next(error);
    }
  }

  // 게시글 상세 조회 API
  async getPostById(req, res, next) {
    try {
      const { postId } = req.params;

      const post = await postsService.findPostById(postId);

      return res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req, res, next) {
    try {
      const { postId } = req.params;

      const { password, title, content } = req.body;

      const updatedPost = await postsService.updatePost(postId, password, title, content);

      return res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      const { postId } = req.param;
      const { password } = req.body;

      const deletedPost = await postsService.deletePost(postId, password);

      return res.status(200).json(deletedPost);
    } catch (error) {
      next(error);
    }
  }
}
